from setuptools import setup, find_packages

setup(
    name="legalease",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.104.1",
        "uvicorn>=0.24.0",
        "pydantic>=2.4.2",
        "pydantic-settings>=2.0.3",
        "python-dotenv>=1.0.0",
        "python-multipart>=0.0.6",
        "httpx>=0.24.1",
        "anyio>=4.9.0",
        "motor>=3.3.2",
        "pymongo[srv]>=4.6.1",
        "python-magic>=0.4.27"
    ],
) 