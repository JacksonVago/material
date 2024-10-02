import { BrowserRouter } from "react-router-dom";

import { AppThemeProvider, AuthProvider, DrawerProvider } from "./shared/contexts";
import { Login, MenuLateral } from "./shared/components";
import { AppRoutes } from "./routes";
import './shared/form/TraducaoYup';
import './App.css'
import './fonts/Poppins-Black.ttf';
import './fonts/Poppins-BlackItalic.ttf';
import './fonts/Poppins-Bold.ttf';
import './fonts/Poppins-BoldItalic.ttf';
import './fonts/Poppins-ExtraBold.ttf';
import './fonts/Poppins-ExtraBoldItalic.ttf';
import './fonts/Poppins-ExtraLight.ttf';
import './fonts/Poppins-ExtraLightItalic.ttf';
import './fonts/Poppins-Italic.ttf';

export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider >

        <Login>

          <DrawerProvider >
            <BrowserRouter>

              <MenuLateral>
                <AppRoutes />
              </MenuLateral>
              
            </BrowserRouter>
          </DrawerProvider>

        </Login>

      </AppThemeProvider>
    </AuthProvider>
  );
}
