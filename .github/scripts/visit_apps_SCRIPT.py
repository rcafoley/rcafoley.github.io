"""Visit each Streamlit Community Cloud app in a real browser so it stays awake.

If an app is asleep, click the "Yes, get this app back up!" button and wait
for it to boot. Exits non-zero if any app fails, so GitHub emails you.
"""
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

APPS = [
    "https://foleysett.streamlit.app/",
    "https://foleyforceprofileapp.streamlit.app/",
]

BOOT_TIMEOUT_S = 240  # cold starts can take a few minutes
STAY_S = 20           # linger so the visit registers as a real session
SHOTS = Path("screenshots")


def app_is_rendered(page) -> bool:
    """True once the Streamlit app root exists in the page or its iframe."""
    for frame in page.frames:
        try:
            if frame.locator('[data-testid="stApp"], .stApp').count() > 0:
                return True
        except Exception:
            pass
    return False


def wake(page, url: str) -> bool:
    print(f"\n→ {url}")
    page.goto(url, wait_until="domcontentloaded", timeout=90_000)
    page.wait_for_timeout(5_000)

    wake_button = page.get_by_role("button", name="get this app back up")
    if wake_button.count() > 0:
        print("  asleep, clicking wake button")
        wake_button.first.click()
    else:
        print("  no wake button, app should already be up")

    deadline = time.time() + BOOT_TIMEOUT_S
    while time.time() < deadline:
        if app_is_rendered(page):
            print("  app rendered ✅")
            page.wait_for_timeout(STAY_S * 1000)
            return True
        page.wait_for_timeout(5_000)

    SHOTS.mkdir(exist_ok=True)
    name = url.split("//")[1].split(".")[0]
    page.screenshot(path=str(SHOTS / f"{name}.png"), full_page=True)
    print("  ❌ app did not render in time (screenshot saved)")
    return False


def main() -> int:
    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for url in APPS:
            page = browser.new_page()
            try:
                if not wake(page, url):
                    failures.append(url)
            except Exception as e:
                print(f"  ❌ error: {e}")
                failures.append(url)
            finally:
                page.close()
        browser.close()

    if failures:
        print("\nFailed:", *failures, sep="\n  ")
        return 1
    print("\nAll apps awake.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
