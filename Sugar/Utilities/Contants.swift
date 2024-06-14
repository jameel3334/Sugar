//
//  Contants.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
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
        public static let heart                  = "heart"
        public static let heartFilled            = "heart.fill"
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
