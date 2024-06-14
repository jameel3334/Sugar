//
//  DetailedItemView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import SwiftUI

struct DetailedItemView: View {
    @ObservedObject var viewModel = MealViewModel()
    @State var image: UIImage? = UIImage(systemName: "photo")
    @State private var mealAlertIsShowing   = false
    let id: String
    var body: some View {
        ScrollView {
            if let meal = viewModel.fetchedMeal {
                VStack {
                    if let image = image {
                        Image(uiImage: image)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .overlay(
                                HeaderTextView(text: meal.title,
                                               multiTextAlignment: .leading,
                                               color: .white,
                                               font: .title)
                                .shadow(color: .black, radius: 1)
                                .offset(y: 170)
                                .padding()
                            )
                    }
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
                .onAppear {
                    Task {
                        if let url = URL(string: meal.imageURL) {
                            do {
                                self.image = try await APIService.shared.downloadImage(using: url, for: meal.id)
                            } catch {
                                throw APIError.invalidData
                            }
                        }
                    }
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .task {
            do {
                try await viewModel.fetchMeals(using: id)
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
    @EnvironmentObject var viewModel: FavoriteViewModel
    let meal: Meal
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
