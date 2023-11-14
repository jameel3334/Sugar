//
//  DetailedItemView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

struct DetailedItemView: View {
    
    @ObservedObject var mealViewModel = MealViewModel()
    @State private var mealAlertIsShowing   = false
    var id: String
    
    var body: some View {
        ScrollView {
            if let meal = mealViewModel.fetchedMeal {
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
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        AddToFavorite(meal: meal)
                    }
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .task {
            do {
                try await mealViewModel.fetchMealsData(using: id)
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

struct AddToFavorite: View {
    @EnvironmentObject var viewModel:FavoriteViewModel
    var meal: Meal
    var body: some View {
        if !viewModel.addedItems.contains(meal) {
            Button(action:  {
                viewModel.add(addedItem: meal)
            }) {
                Image(systemName: Constants.Image.heart)
                    .foregroundColor(.gray)
            }
            .padding(.vertical, 10)
            
        } else {
            Button(action:  {
                viewModel.undo(addedItem: meal)
            }) {
                Image(systemName: Constants.Image.heartFilled)
                    .foregroundColor(.red)
            }
            .padding(.vertical, 10)
        }
    }
}

struct DetailedComponentView_Previews: PreviewProvider {
    static var previews: some View {
        DetailedItemView(id: "52855")
    }
}
