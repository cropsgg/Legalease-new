"""Utility functions for tax filing automation"""
import asyncio
from typing import Any, Dict, Optional
from playwright.async_api import Page
from .constants import Selectors, TIMEOUT_DURATION

async def wait_and_fill(page: Page, selector: str, value: str, timeout: int = TIMEOUT_DURATION):
    """Wait for element and fill value"""
    await page.wait_for_selector(selector, timeout=timeout)
    await page.fill(selector, value)

async def wait_and_click(page: Page, selector: str, timeout: int = TIMEOUT_DURATION):
    """Wait for element and click"""
    await page.wait_for_selector(selector, timeout=timeout)
    await page.click(selector)

async def wait_for_navigation(page: Page, url: str, timeout: int = TIMEOUT_DURATION):
    """Wait for navigation to specific URL"""
    await page.wait_for_url(url, timeout=timeout)

async def extract_text(page: Page, selector: str, timeout: int = TIMEOUT_DURATION) -> str:
    """Extract text from element"""
    element = await page.wait_for_selector(selector, timeout=timeout)
    return await element.text_content() if element else ""

async def handle_captcha(page: Page) -> str:
    """Extract and return captcha text"""
    captcha_element = await page.wait_for_selector(Selectors.CAPTCHA_TEXT)
    return await captcha_element.text_content() if captcha_element else ""

async def verify_success_message(page: Page, expected_message: str) -> bool:
    """Verify success message on page"""
    try:
        await page.wait_for_selector(f"text={expected_message}", timeout=TIMEOUT_DURATION)
        return True
    except Exception:
        return False

async def handle_error(page: Page, error_message: str) -> Dict[str, Any]:
    """Handle errors during automation"""
    screenshot = await page.screenshot(type="png")
    return {
        "error": error_message,
        "screenshot": screenshot,
        "url": page.url
    }

async def wait_for_download(page: Page) -> Optional[str]:
    """Wait for file download"""
    async with page.expect_download() as download_info:
        await page.click('button:has-text("Download")')
        download = await download_info.value
        await download.save_as(f"downloads/{download.suggested_filename}")
        return download.suggested_filename

async def retry_with_timeout(func, *args, retries: int = 3, timeout: int = TIMEOUT_DURATION):
    """Retry function with timeout"""
    for attempt in range(retries):
        try:
            return await asyncio.wait_for(func(*args), timeout=timeout/1000)
        except asyncio.TimeoutError:
            if attempt == retries - 1:
                raise
            await asyncio.sleep(1) 