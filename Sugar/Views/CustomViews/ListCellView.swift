//
//  ListCellView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import SwiftUI

struct ListCellView: View {
    @StateObject var viewModel = DessertsViewModel()
    @State var image: UIImage? = UIImage(systemName: "photo")
    let imageURL: String
    let title: String
    var body: some View {
        HeaderTextView(text: title,
                       multiTextAlignment: .leading,
                       color: .white)
        .shadow(color: .black, radius: 1)
        .minimumScaleFactor(0.7)
        .padding(EdgeInsets(top: 35, leading: 10, bottom: 35, trailing: 0))
        .offset(y: 20)
        .background(
            Group {
                if let image = image {
                    Image(uiImage: image)
                        .opacity(0.5)
                        .scaledToFill()
                }
            }
        )
        .background(
            Color.gray
        )
        .mask(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
        )
        .onAppear {
            Task {
                if let url = URL(string: imageURL) {
                    do {
                        self.image = try await APIService.shared.downloadImage(using: url, for: title)
                    } catch {
                        throw APIError.invalidData
                    }
                }
            }
        }
    }
}
