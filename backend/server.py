from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import secrets


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Security
SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="AdaCapitalMarket API", description="Forex Trading Platform API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# User Models
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    country: Optional[str] = None

class UserCreate(UserBase):
    password: str
    confirm_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    is_verified: bool = False

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Trading Account Models
class TradingAccount(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    account_type: str  # standard, raw+, elite
    account_number: str = Field(default_factory=lambda: f"ADA{secrets.randbelow(1000000):06d}")
    balance: float = 0.0
    equity: float = 0.0
    margin: float = 0.0
    free_margin: float = 0.0
    margin_level: float = 0.0
    currency: str = "USD"
    leverage: str = "1:500"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class TradingAccountCreate(BaseModel):
    account_type: str

# Trade Models
class Trade(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    account_id: str
    symbol: str
    trade_type: str  # buy, sell
    volume: float
    open_price: float
    current_price: float
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    profit: float = 0.0
    swap: float = 0.0
    commission: float = 0.0
    opened_at: datetime = Field(default_factory=datetime.utcnow)
    closed_at: Optional[datetime] = None
    status: str = "open"  # open, closed

# Market Data Models
class MarketPrice(BaseModel):
    symbol: str
    bid: float
    ask: float
    spread: float
    change: float
    change_percent: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Deposit/Withdrawal Models
class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    account_id: str
    transaction_type: str  # deposit, withdrawal
    amount: float
    currency: str = "USD"
    method: str  # bank_transfer, card, crypto
    status: str = "pending"  # pending, completed, failed
    created_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None

class TransactionCreate(BaseModel):
    account_id: str
    transaction_type: str
    amount: float
    method: str


# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    return UserInDB(**user)


# Auth Routes
@api_router.post("/auth/register", response_model=dict)
async def register_user(user: UserCreate):
    # Check if passwords match
    if user.password != user.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict(exclude={"password", "confirm_password"})
    db_user = UserInDB(**user_dict, hashed_password=hashed_password)
    
    await db.users.insert_one(db_user.dict())
    
    # Create default trading account
    default_account = TradingAccount(
        user_id=db_user.id,
        account_type="standard",
        balance=10000.0,  # Demo balance
        equity=10000.0,
        free_margin=10000.0
    )
    await db.trading_accounts.insert_one(default_account.dict())
    
    return {"message": "User registered successfully", "user_id": db_user.id}

@api_router.post("/auth/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    user = await db.users.find_one({"email": user_credentials.email})
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=User)
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    return User(**current_user.dict())


# Trading Account Routes
@api_router.get("/accounts", response_model=List[TradingAccount])
async def get_user_accounts(current_user: UserInDB = Depends(get_current_user)):
    accounts = await db.trading_accounts.find({"user_id": current_user.id}).to_list(100)
    return [TradingAccount(**account) for account in accounts]

@api_router.post("/accounts", response_model=TradingAccount)
async def create_trading_account(account_data: TradingAccountCreate, current_user: UserInDB = Depends(get_current_user)):
    new_account = TradingAccount(
        user_id=current_user.id,
        account_type=account_data.account_type,
        balance=10000.0 if account_data.account_type == "standard" else 50000.0,
        equity=10000.0 if account_data.account_type == "standard" else 50000.0,
        free_margin=10000.0 if account_data.account_type == "standard" else 50000.0
    )
    await db.trading_accounts.insert_one(new_account.dict())
    return new_account


# Market Data Routes
@api_router.get("/market/prices", response_model=List[MarketPrice])
async def get_market_prices():
    # Mock market data - in real implementation, this would come from a data provider
    mock_prices = [
        MarketPrice(symbol="EURUSD", bid=1.0920, ask=1.0925, spread=0.5, change=0.0025, change_percent=0.23),
        MarketPrice(symbol="GBPUSD", bid=1.2645, ask=1.2650, spread=0.5, change=-0.0015, change_percent=-0.12),
        MarketPrice(symbol="USDJPY", bid=149.82, ask=149.87, spread=0.5, change=0.45, change_percent=0.30),
        MarketPrice(symbol="USDCHF", bid=0.8765, ask=0.8770, spread=0.5, change=-0.0008, change_percent=-0.09),
        MarketPrice(symbol="AUDUSD", bid=0.6684, ask=0.6689, spread=0.5, change=0.0012, change_percent=0.18),
        MarketPrice(symbol="USDCAD", bid=1.3542, ask=1.3547, spread=0.5, change=0.0021, change_percent=0.16),
        MarketPrice(symbol="XAUUSD", bid=2045.20, ask=2047.80, spread=2.6, change=12.50, change_percent=0.61),
        MarketPrice(symbol="XAGUSD", bid=24.85, ask=24.92, spread=0.07, change=-0.34, change_percent=-1.35),
    ]
    return mock_prices


# Trading Routes
@api_router.get("/trades", response_model=List[Trade])
async def get_user_trades(current_user: UserInDB = Depends(get_current_user)):
    trades = await db.trades.find({"user_id": current_user.id}).to_list(100)
    return [Trade(**trade) for trade in trades]

@api_router.post("/trades", response_model=Trade)
async def create_trade(trade_data: dict, current_user: UserInDB = Depends(get_current_user)):
    # Mock trade creation
    new_trade = Trade(
        user_id=current_user.id,
        account_id=trade_data["account_id"],
        symbol=trade_data["symbol"],
        trade_type=trade_data["trade_type"],
        volume=trade_data["volume"],
        open_price=trade_data["price"],
        current_price=trade_data["price"]
    )
    await db.trades.insert_one(new_trade.dict())
    return new_trade


# Transaction Routes
@api_router.get("/transactions", response_model=List[Transaction])
async def get_user_transactions(current_user: UserInDB = Depends(get_current_user)):
    transactions = await db.transactions.find({"user_id": current_user.id}).to_list(100)
    return [Transaction(**transaction) for transaction in transactions]

@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction_data: TransactionCreate, current_user: UserInDB = Depends(get_current_user)):
    new_transaction = Transaction(
        user_id=current_user.id,
        account_id=transaction_data.account_id,
        transaction_type=transaction_data.transaction_type,
        amount=transaction_data.amount,
        method=transaction_data.method
    )
    await db.transactions.insert_one(new_transaction.dict())
    return new_transaction


# Dashboard Routes
@api_router.get("/dashboard/summary")
async def get_dashboard_summary(current_user: UserInDB = Depends(get_current_user)):
    # Get user's accounts
    accounts = await db.trading_accounts.find({"user_id": current_user.id}).to_list(100)
    
    # Get recent trades
    recent_trades = await db.trades.find({"user_id": current_user.id}).sort("opened_at", -1).limit(5).to_list(5)
    
    # Get recent transactions
    recent_transactions = await db.transactions.find({"user_id": current_user.id}).sort("created_at", -1).limit(5).to_list(5)
    
    # Calculate totals
    total_balance = sum(account.get("balance", 0) for account in accounts)
    total_equity = sum(account.get("equity", 0) for account in accounts)
    open_trades_count = len([trade for trade in recent_trades if trade.get("status") == "open"])
    
    return {
        "total_balance": total_balance,
        "total_equity": total_equity,
        "total_profit": total_equity - total_balance,
        "open_trades": open_trades_count,
        "accounts": [TradingAccount(**account) for account in accounts],
        "recent_trades": [Trade(**trade) for trade in recent_trades],
        "recent_transactions": [Transaction(**transaction) for transaction in recent_transactions]
    }


# Original status routes
@api_router.get("/")
async def root():
    return {"message": "AdaCapitalMarket API is running", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()