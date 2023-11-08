//
//  ImageView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

struct ImageView: View {
    
    let imageURL: String?
    
    var body: some View {
        if let imageURL = imageURL {
            CacheAsyncImage(url: URL(string: imageURL) ?? URL(string: Constants.Image.mealPlaceholderImage)!,
                            content: { phase in
                switch phase {
                case .empty :
                    Image(uiImage: UIImage(named: Constants.Image.mealPlaceholderImage) ?? UIImage())
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .overlay {
                            if URL(string: imageURL) != nil {
                                ProgressView()
                                    .frame(maxWidth: .infinity,
                                           maxHeight: .infinity)
                                    .background(.gray.opacity(0.4))
                            }
                        }
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                case .failure:
                    Image(uiImage: UIImage(named: Constants.Image.mealPlaceholderImage) ?? UIImage())
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                @unknown default:
                    EmptyView()
                }
            }
            )}
    }
}


struct ImageView_Preview: PreviewProvider {
    static var previews: some View {
        ImageView(imageURL: "https://www.themealdb.com/images/media/meals/sywswr1511383814.jpg")
    }
}
