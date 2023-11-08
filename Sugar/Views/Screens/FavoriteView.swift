//
//  FavoriteView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

struct FavoriteView: View {
    @EnvironmentObject var viewModel: FavoriteViewModel
    var body: some View {
        NavigationView {
            Form {
                ForEach(viewModel.addedItems, id: \.id) { dessert in
                    NavigationLink(
                        destination:
                            DetailedItemView(id: dessert.id),
                        
                        label: {
                            ListRowView(imageURL: dessert.imageURL, title: dessert.title)
                        })
                }
                .onDelete(perform: viewModel.remove)
            }
            .navigationBarTitle(Constants.String.favoritesTitle)
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                EditButton()
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
}
