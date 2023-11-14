//
//  Constants.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import Foundation


enum Constants {
    enum Url {
        public static let mealBaseURL = "https://themealdb.com/api/json/v1/1/lookup.php?i="
        public static let dessertsURL = "https://themealdb.com/api/json/v1/1/filter.php?c=Dessert"
    }
    enum Color {
        public static let textColor   = "textViewColor"
        public static let accentColor = "AccentColor"
    }
    enum Image {
        public static let sugarImage             = "sugarImage"
        public static let cornerRadius: CGFloat  = 10.0
        public static let mealPlaceholderImage   = "mealPlaceholder"
        public static let bookClosed             = "book.closed"
        public static let heart                  = "heart"
        public static let heartFilled            = "heart.fill"
        public static let infoCircle             = "info.circle"
        
    }
    enum String {
        public static let dessertsTitle         = "DESSERTS"
        public static let favoritesTitle        = "FAVORITES"
        public static let appName               = "Sugar Rush"
        public static let instructionViewTitle  = "Instructions"
        public static let ingredientsViewTitle  = "Ingredients"
        public static let alertTitle            = "Something went wrong"
        public static let alertMessage          = "Unable to complete your request, Please try again later"
    }
}
