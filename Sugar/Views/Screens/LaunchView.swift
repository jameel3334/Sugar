//
//  LaunchView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

struct LaunchView: View {
    
    @State private var launchScreenIsShowing = true
    @State private var size                  = 0.75
    @State private var opacity               = 0.75

    var body: some View {
        if launchScreenIsShowing {
            ZStack {
                LinearGradient(colors: [.orange, Color(Constants.Color.accentColor).opacity(0.05)],
                               startPoint: .topLeading,
                               endPoint: .bottomTrailing)
                .ignoresSafeArea()
                VStack {
                    Image(uiImage: UIImage(named:Constants.Image.sugarImage) ?? UIImage ())
                        .resizable()
                        .frame(width: 200, height: 200)
                        .opacity(opacity)
                      .scaleEffect(size)
                    
                    Text(Constants.String.appName.uppercased())
                        .cornerRadius(12)
                        .scaleEffect(size)
                        .opacity(opacity)
                        .font(.title.weight(.bold))
                }
                .onAppear {
                    withAnimation(.easeIn(duration: 1)) {
                        self.size = 1.0
                        self.opacity = 1.0
                    }
                    Task {
                        try await Task.sleep(nanoseconds: UInt64(2.2e+9))
                        withAnimation {
                            self.launchScreenIsShowing = false
                        }
                    }
                }
            }
        } else {
            DessertsListView()
        }
    }
}

struct LaunchView_Preview: PreviewProvider {
    static var previews: some View {
        LaunchView()
    }
}


