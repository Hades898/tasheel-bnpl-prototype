import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

type ScreenKey =
  | 'checkout'
  | 'mobile'
  | 'otpEmpty'
  | 'otpFilled'
  | 'identityEmpty'
  | 'identityFilled'
  | 'nafath'
  | 'quickCall'
  | 'tenure'
  | 'payment'
  | 'processing'
  | 'success'
  | 'cardAnimation'
  | 'home'
  | 'details'
  | 'insights'
  | 'purchases'
  | 'dues';

type Step = {
  key: ScreenKey;
  name: string;
  figma: string;
  next?: ScreenKey;
  width: number;
  height: number;
  source: ImageSourcePropType;
};

const steps: Step[] = [
  { key: 'checkout', name: '6.0 — Extrastores Checkout', figma: '1741:78002', next: 'mobile', width: 414, height: 860, source: require('./assets/figma-screens/checkout-1741-78002.png') },
  { key: 'mobile', name: 'Confirm Mobile Number', figma: '1741:78634', next: 'otpEmpty', width: 438, height: 860, source: require('./assets/figma-screens/confirm-mobile-1741-78634.png') },
  { key: 'otpEmpty', name: 'OTP empty', figma: '1741:78043', next: 'otpFilled', width: 390, height: 848, source: require('./assets/figma-screens/otp-empty-1741-78043.png') },
  { key: 'otpFilled', name: 'OTP filled', figma: '1741:78067', next: 'identityEmpty', width: 390, height: 848, source: require('./assets/figma-screens/otp-filled-1741-78067.png') },
  { key: 'identityEmpty', name: 'Identity Verification empty', figma: '1741:78576', next: 'identityFilled', width: 414, height: 860, source: require('./assets/figma-screens/identity-empty-1741-78576.png') },
  { key: 'identityFilled', name: 'Identity Verification filled', figma: '1741:78605', next: 'nafath', width: 414, height: 860, source: require('./assets/figma-screens/identity-filled-1741-78605.png') },
  { key: 'nafath', name: 'Nafath', figma: '1741:78091', next: 'quickCall', width: 414, height: 860, source: require('./assets/figma-screens/nafath-1741-78091.png') },
  { key: 'quickCall', name: 'Quick Call', figma: '1741:78139', next: 'tenure', width: 542, height: 916, source: require('./assets/figma-screens/quick-call-1741-78139.png') },
  { key: 'tenure', name: 'Tenure plan', figma: '1741:78156', next: 'payment', width: 414, height: 860, source: require('./assets/figma-screens/tenure-plan-1741-78156.png') },
  { key: 'payment', name: 'Tenure payment method', figma: '1741:78226', next: 'processing', width: 414, height: 860, source: require('./assets/figma-screens/tenure-payment-1741-78226.png') },
  { key: 'processing', name: 'Processing', figma: '1741:78493', next: 'success', width: 414, height: 860, source: require('./assets/figma-screens/processing-1741-78493.png') },
  { key: 'success', name: 'Approved / Download app', figma: '1741:78516', next: 'cardAnimation', width: 414, height: 860, source: require('./assets/figma-screens/success-1741-78516.png') },
  { key: 'cardAnimation', name: 'Tasheel card animation', figma: '1747:80000', next: 'home', width: 473, height: 1024, source: require('./assets/figma-screens/card-animation-1747-80000.png') },
  { key: 'home', name: 'BNPL Home', figma: '1741:79204', next: 'details', width: 399, height: 1024, source: require('./assets/figma-screens/bnpl-home-1741-79204.png') },
  { key: 'details', name: 'Transaction details [flow]', figma: '1741:79381', next: 'insights', width: 310, height: 1024, source: require('./assets/figma-screens/transaction-details-1741-79381.png') },
  { key: 'insights', name: 'Insights · Full history', figma: '1741:79259', next: 'purchases', width: 402, height: 870, source: require('./assets/figma-screens/insights-history-1741-79259.png') },
  { key: 'purchases', name: 'My purchases', figma: '1741:79334', next: 'dues', width: 402, height: 918, source: require('./assets/figma-screens/my-purchases-1741-79334.png') },
  { key: 'dues', name: 'My dues', figma: '1747:80163', width: 402, height: 890, source: require('./assets/figma-screens/my-dues-1747-80163.png') },
];

const stepIndex = Object.fromEntries(steps.map((step, index) => [step.key, index])) as Record<ScreenKey, number>;

function FigmaScreen({ step, onNext }: { step: Step; onNext: () => void }) {
  const imageScale = Math.min(390 / step.width, 848 / step.height);
  const renderedWidth = Math.round(step.width * imageScale);
  const renderedHeight = Math.round(step.height * imageScale);

  return (
    <View style={styles.phoneClip}>
      <ScrollView
        style={styles.screenScroll}
        contentContainerStyle={[styles.screenContent, { minHeight: 848 }]}
        showsVerticalScrollIndicator={false}
      >
        <Image source={step.source} style={{ width: renderedWidth, height: renderedHeight }} resizeMode="contain" />
      </ScrollView>
      <Pressable accessibilityRole="button" accessibilityLabel="Next screen" onPress={onNext} style={styles.nextOverlay} />
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>('checkout');
  const { height, width } = useWindowDimensions();
  const compact = width < 880;
  const currentIndex = stepIndex[screen];
  const currentStep = steps[currentIndex];
  const complete = useMemo(() => Math.round(((currentIndex + 1) / steps.length) * 100), [currentIndex]);
  const horizontalRoom = width < 880 ? width - 40 : width - 520;
  const verticalRoom = compact ? height - 312 : height - 72;
  const phoneScale = Math.min(1, Math.max(compact ? 0.38 : 0.54, Math.min(verticalRoom / 848, horizontalRoom / 390)));
  const goNext = () => {
    if (currentStep.next) setScreen(currentStep.next);
  };

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar style="light" />
      <View style={[styles.stage, compact && styles.stageNarrow]}>
        <View style={[styles.sidePanel, compact && styles.sidePanelNarrow]}>
          <Text style={styles.brand}>TAS'HEEL BNPL</Text>
          <Text style={[styles.desktopTitle, compact && styles.desktopTitleCompact]}>BNPL Figma-matched prototype</Text>
          <Text style={[styles.desktopCopy, compact && styles.desktopCopyCompact]}>
            Dedicated BNPL link. This prototype renders exported Figma frames from node 1747:80160 directly for pixel fidelity; it is intentionally separate from Flash Cash.
          </Text>
          <View style={styles.progressTrack}><View style={[styles.progressFillWide, { width: `${complete}%` }]} /></View>
          <Text style={styles.desktopMeta}>{complete}% through flow · current source {currentStep.figma}</Text>
          <ScrollView horizontal={width < 880} style={styles.stepList} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            {steps.map((step, index) => (
              <Pressable key={step.key} style={[styles.stepRow, screen === step.key && styles.stepRowActive]} onPress={() => setScreen(step.key)}>
                <Text style={[styles.stepNum, screen === step.key && styles.stepNumActive]}>{String(index + 1).padStart(2, '0')}</Text>
                <View style={styles.flex}>
                  <Text numberOfLines={1} style={styles.stepName}>{step.name}</Text>
                  <Text style={styles.stepFigma}>{step.figma}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <View style={styles.prototypeCanvas}>
          <View style={{ width: 390 * phoneScale, height: 848 * phoneScale, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 390, height: 848, transform: [{ scale: phoneScale }] }}>
              <FigmaScreen step={currentStep} onNext={goNext} />
            </View>
          </View>
          {!compact && <Text style={styles.tapHint}>{currentStep.next ? 'Tap the phone to continue the Figma flow' : 'End of BNPL flow'}</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
}

const green = '#003f1f';
const neon = '#52ff00';

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#171717' },
  stage: { flex: 1, flexDirection: 'row', padding: 24, gap: 24 },
  stageNarrow: { flexDirection: 'column', padding: 16, gap: 14 },
  sidePanel: { width: 390, borderRadius: 28, backgroundColor: '#f7f8f7', padding: 24, gap: 14 },
  sidePanelNarrow: { width: '100%', maxHeight: 282, padding: 24, gap: 10 },
  brand: { fontSize: 13, letterSpacing: 1.5, fontWeight: '900', color: green },
  desktopTitle: { fontSize: 31, lineHeight: 35, fontWeight: '900', color: '#0c1210' },
  desktopTitleCompact: { fontSize: 28, lineHeight: 32 },
  desktopCopy: { fontSize: 14, lineHeight: 20, color: '#5e6965' },
  desktopCopyCompact: { fontSize: 14, lineHeight: 19 },
  desktopMeta: { color: '#5e6965', fontSize: 12, fontWeight: '700' },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: '#dfe7e2', overflow: 'hidden' },
  progressFillWide: { height: 8, borderRadius: 999, backgroundColor: neon },
  stepList: { flex: 1, minHeight: 0, marginTop: 8 },
  stepRow: { width: 342, flexDirection: 'row', gap: 12, padding: 12, borderRadius: 16, marginBottom: 8, marginRight: 8, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5ece8' },
  stepRowActive: { borderColor: green, backgroundColor: '#eaf5ed' },
  stepNum: { width: 28, color: '#8b9691', fontWeight: '900' },
  stepNumActive: { color: green },
  stepName: { fontSize: 14, fontWeight: '800', color: '#0c1210' },
  stepFigma: { fontSize: 12, color: '#7b8580', marginTop: 2 },
  flex: { flex: 1, minWidth: 0 },
  prototypeCanvas: { flex: 1, minHeight: 0, borderRadius: 28, backgroundColor: '#222222', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 12 },
  phoneClip: { width: 390, height: 848, backgroundColor: '#ffffff', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 40, shadowOffset: { width: 0, height: 20 } },
  screenScroll: { width: 390, height: 848, backgroundColor: '#ffffff' },
  screenContent: { width: 390, alignItems: 'center', backgroundColor: '#ffffff' },
  nextOverlay: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
  tapHint: { position: 'absolute', bottom: 16, color: '#aab3af', fontSize: 12, fontWeight: '700' },
});
