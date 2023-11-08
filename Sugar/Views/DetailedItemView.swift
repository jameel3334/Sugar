//
//  DetailedItemView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

struct DetailedItemView: View {
    
    @ObservedObject var viewModel = MealViewModel()
    @State private var isFavorite           = false
    @State private var mealAlertIsShowing   = false
    var id: String
    
    var body: some View {
        ScrollView {
            if let meal = viewModel.fetchedMeal {
                VStack {
                    ImageView(imageURL: meal.imageURL)
                        .overlay(
                            HeaderTextView(text: meal.title,
                                           multiTextAlignment: .leading,
                                           color: .white,
                                           font: .title)
                            .shadow(color: .black, radius: 1)
                            .offset(y: 170)
                            .padding()
                        )
                    IngredientsView(text: meal.ingredientsAndMeasures)
                        .padding()
                    Divider()
                    InstructionsView(text: meal.instructions)
                        .padding()
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .task {
            do {
                try await viewModel.fetchMealsData(using: id)
            } catch {
                mealAlertIsShowing = true
            }
        }
        .alert(isPresented: $mealAlertIsShowing) {
            Alert(
                title: Text(Constants.String.alertTitle),
                message: Text(Constants.String.alertMessage),
                dismissButton: .default(Text("OK"))
            )}
    }
}


struct DetailedComponentView_Previews: PreviewProvider {
    static var previews: some View {
        DetailedItemView(id: "52855")
    }
}
