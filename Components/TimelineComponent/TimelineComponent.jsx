import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const statusOptions = [
  { key: "NEW", label: "New Order" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "MANUFACTURING", label: "Manufacturing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "RETURNED", label: "Returned" },
];

const TimelineComponent = ({ orderStatus }) => {
  const currentIndex = statusOptions.findIndex(option => option.key === orderStatus);

  return (
    <ScrollView horizontal style={styles.scroll} contentContainerStyle={styles.container}>
      {statusOptions.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isLast = index === statusOptions.length - 1;

        return (
          <View key={status.key} style={styles.item}>
            {/* Label */}
            <Text style={[
              styles.label,
              isCompleted ? styles.labelCompleted : styles.labelPending
            ]}>
              {status.label}
            </Text>
            {/* Dot + Line */}
            <View style={styles.dotLineRow}>
              <View style={[
                styles.dot,
                isCompleted ? styles.dotCompleted : styles.dotPending
              ]}>
                {isCompleted ? (
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path
                      d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                      fill="#22C55E"
                    />
                  </Svg>
                ) : (
                  <View style={styles.innerDot} />
                )}
              </View>
              {/* Line (not for last item) */}
              {!isLast && (
                <View style={[
                  styles.line,
                  isCompleted ? styles.lineCompleted : styles.linePending
                ]} />
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { marginVertical: 8 },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minWidth: 640,
    paddingHorizontal: 8,
  },
  item: {
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  labelCompleted: { color: '#22C55E' },
  labelPending: { color: '#D1D5DB' },
  dotLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -1,
    zIndex: 1,
  },
  dotCompleted: { borderColor: '#22C55E' },
  dotPending: { borderColor: '#D1D5DB' },
  innerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
  },
  line: {
    height: 4,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  lineCompleted: { backgroundColor: '#22C55E' },
  linePending: { backgroundColor: '#D1D5DB' },
});

export default TimelineComponent;