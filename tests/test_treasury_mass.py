import re
from playwright.sync_api import Page, expect

def test_homepage_has_treasury_mass(page: Page):
    page.goto("/")

    # Look for the main heading of the new section
    treasury_mass_heading = page.locator('h2:has-text("TREASURY_MASS: VERIFIED")')

    # Wait up to 30 seconds for the element to be visible
    expect(treasury_mass_heading).to_be_visible(timeout=30000)

    # Take a screenshot to verify
    page.screenshot(path="treasury_mass_verified.png")
