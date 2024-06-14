//
//  DessertsListView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import SwiftUI

struct DessertsListView: View {
    @StateObject var viewModel = DessertsViewModel()
    @State var showAlert = false
    var body: some View {
        NavigationView {
            List (viewModel.desserts.sorted(by: { $0.title < $1.title })) { dessert in
                NavigationLink(destination: DetailedItemView(id: dessert.id),
                               label:  {
                    ListCellView(imageURL: dessert.image, title: dessert.title)
                })
                .listRowSeparator(.hidden)
            }
            .listStyle(.grouped)
            .navigationBarTitle(Constants.String.dessertsTitle)
            .navigationBarTitleDisplayMode(.automatic)
        }
        .task {
            do {
                try await viewModel.fetchDesserts()
            } catch {
                showAlert = true
            }}
        .alert(isPresented: $showAlert) {
            Alert(
                title: Text(Constants.String.alertTitle),
                message: Text(Constants.String.alertMessage),
                dismissButton: .default(Text("OK"))
            )
        }
    }
}

