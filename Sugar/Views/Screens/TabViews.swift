//
//  TabViews.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

struct TabViews: View {
    @EnvironmentObject var viewModel: FavoriteViewModel
    var body: some View {
        TabView {
            DessertsListView()
                .tabItem {
                    Image(systemName: "book")
                    Text("Book")
                }
                .tag(0)
            FavoriteView()
                .tabItem {
                    Image(systemName: "heart")
                    Text("Favorite")
                }
                .tag(1)
                .badge(viewModel.addedItems.count)
        }
    }
}
