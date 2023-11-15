//
//  SugarUITests.swift
//  SugarUITests
//
//  Created by Mohammed Jameeluddin on 11/13/23.
//

import XCTest
@testable import Sugar

final class SugarUITests: XCTestCase {
    var app: XCUIApplication!
    
    override func setUpWithError() throws {
        app = XCUIApplication()
        app.launch()
        continueAfterFailure = false
        XCTAssertTrue(app.navigationBars["DESSERTS"].waitForExistence(timeout: 6), "The Launch screen will complete")
    }
    
    func test_backNavigation() {
        let dessertsStaticText = app.navigationBars["DESSERTS"].staticTexts["DESSERTS"]
        dessertsStaticText.tap()
        app.collectionViews.firstMatch.tap()
        let dessertsButton = app.navigationBars["_TtGC7SwiftUI19UIHosting"].buttons["DESSERTS"]
        dessertsButton.tap()
        dessertsStaticText.tap()
        XCTAssertTrue(dessertsStaticText.exists)
    }
    
    func test_favoritesButtonAddsFavoriteItem() {
        let app = XCUIApplication()
        app.collectionViews.firstMatch.tap()
        XCTAssertTrue(app/*@START_MENU_TOKEN@*/.buttons["Love"]/*[[".otherElements[\"Love\"].buttons[\"Love\"]",".buttons[\"Love\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/.exists)
        app.navigationBars["_TtGC7SwiftUI19UIHosting"]/*@START_MENU_TOKEN@*/.buttons["Love"]/*[[".otherElements[\"Love\"].buttons[\"Love\"]",".buttons[\"Love\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/.tap()
        app.tabBars["Tab Bar"].buttons["Favorite"].tap()
        XCTAssertTrue(app.collectionViews.firstMatch.exists)
    }
    
}
