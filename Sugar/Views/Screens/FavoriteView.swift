//
//  FavoriteView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import SwiftUI

struct FavoriteView: View {
    @EnvironmentObject var viewModel: FavoriteViewModel
    var body: some View {
        NavigationView {
            List(viewModel.addedItems, id: \.id) { dessert in
                NavigationLink(
                    destination:
                        DetailedItemView(id: dessert.id),
                    
                    label: {
                        ListCellView(imageURL: dessert.imageURL, title: dessert.title)
                    })
                .listRowSeparator(.hidden)
            }
            .listStyle(.grouped)
            .navigationBarTitle(Constants.String.favoritesTitle)
            .navigationBarTitleDisplayMode(.large)
        }
    }
}
