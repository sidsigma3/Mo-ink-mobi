import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text, Dimensions, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

import BlogBox1 from './BlogBox1';
import BlogBox2 from './BlogBox2';
import BlogBox3 from './BlogBox3';
import BlogBox4 from './BlogBox4';

const SCREEN_WIDTH = Dimensions.get('window').width;

const BlogList = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    checkScroll();
  }, [scrollX, contentWidth]);

  const checkScroll = () => {
    setCanScrollLeft(scrollX > 0);
    setCanScrollRight(scrollX < contentWidth - SCREEN_WIDTH);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const x = direction === 'left' ? scrollX - scrollAmount : scrollX + scrollAmount;
      scrollRef.current.scrollTo({ x, animated: true });
      setScrollX(x);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('blog.section.title')}</Text>

      {canScrollLeft && (
        <TouchableOpacity style={styles.leftButton} onPress={() => scroll('left')}>
          <Text style={styles.arrow}>{I18nManager.isRTL ? '›' : '‹'}</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        horizontal
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={(w) => setContentWidth(w)}
        onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.blogBox}><BlogBox1 /></View>
        <View style={styles.blogBox}><BlogBox2 /></View>
        <View style={styles.blogBox}><BlogBox3 /></View>
        <View style={styles.blogBox}><BlogBox4 /></View>
      </ScrollView>

      {canScrollRight && (
        <TouchableOpacity style={styles.rightButton} onPress={() => scroll('right')}>
          <Text style={styles.arrow}>{I18nManager.isRTL ? '‹' : '›'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#111',
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  blogBox: {
    width: SCREEN_WIDTH * 0.7,
    marginHorizontal: 10,
  },
  leftButton: {
    position: 'absolute',
    left: 10,
    top: '50%',
    zIndex: 10,
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 20,
    transform: [{ translateY: -25 }],
  },
  rightButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    zIndex: 10,
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 20,
    transform: [{ translateY: -25 }],
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BlogList;
