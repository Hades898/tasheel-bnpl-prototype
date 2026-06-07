import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';

import CheckoutScreen from './src/screens/CheckoutScreen';
import PrototypeGallery from './src/PrototypeGallery';

/**
 * Minimal route resolution sufficient for web `/checkout` usage.
 * - Web: any path containing "checkout" renders the real checkout UI slice
 *   (Figma node 1741:78002); every other path keeps the existing Figma
 *   prototype gallery so deployed flow assets are not broken.
 * - Native: renders the real checkout slice directly (no URL available).
 */
function resolveRoute(): 'checkout' | 'gallery' {
  if (Platform.OS !== 'web') return 'checkout';
  if (typeof window === 'undefined') return 'gallery';
  return window.location.pathname.toLowerCase().includes('checkout') ? 'checkout' : 'gallery';
}

export default function App() {
  const route = resolveRoute();
  const isCheckout = route === 'checkout';

  return (
    <SafeAreaView style={[styles.root, isCheckout && styles.rootCheckout]}>
      <StatusBar style={isCheckout ? 'dark' : 'light'} />
      {isCheckout ? <CheckoutScreen /> : <PrototypeGallery />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#171717' },
  rootCheckout: { backgroundColor: '#0d0d0f' },
});
