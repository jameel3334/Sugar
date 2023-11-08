//
//  HeaderTextView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

struct HeaderTextView: View {
    var text: String
    var multiTextAlignment: TextAlignment
    var horizontalFixedSize: Bool?
    var verticalFixedSize: Bool?
    var color: Color?
    var font: Font?
    var body: some View {
        Text(text.uppercased())
            .foregroundColor(color)
            .font(font ?? .title3)
            .bold()
            .minimumScaleFactor(0.6)
            .lineLimit(1)
            .frame(maxWidth: .infinity, alignment: .leading)
            .multilineTextAlignment(multiTextAlignment)
            .fixedSize(horizontal: horizontalFixedSize ?? false, vertical: verticalFixedSize ?? true)
    }
}

struct HeaderTextView_Previews: PreviewProvider {
    static var previews: some View {
        HeaderTextView(text: "Hello!", multiTextAlignment: .trailing)
    }
}
