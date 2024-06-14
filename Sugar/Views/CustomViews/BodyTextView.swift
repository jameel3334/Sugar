//
//  BodyTextView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import SwiftUI

struct BodyTextView: View {
    let text: String
    let multiTextAlignment: TextAlignment
    var horizontalFixedSize: Bool?
    var verticalFixedSize: Bool?
    var body: some View {
        Text(text)
            .fontWeight(.regular)
            .lineSpacing(10)
            .font(.body)
            .foregroundColor(Color(Constants.Color.textColor))
            .multilineTextAlignment(multiTextAlignment)
            .fixedSize(horizontal: horizontalFixedSize ?? false, vertical: verticalFixedSize ?? true)
    }
}

struct BodyTextView_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            BodyTextView(text: "Hello!", multiTextAlignment: .center)
        }
    }
}
