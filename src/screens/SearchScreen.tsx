import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { Input } from '../components/common/Input';
import { ProductGrid } from '../components/product/ProductGrid';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = '@vaunt_recent_searches_v1';
const TRENDING_KEYWORDS = [
  'Oversized Tee',
  'Linen Shirt',
  'Selvedge Denim',
  'Court Sneakers',
  'Silk Kurta',
  'Leather Bag',
  'Chronograph Watch',
  'Pleated Trousers',
  'Blazer Dress',
  'Activewear',
];

type RouteProps = RouteProp<{ params: { initialQuery?: string } }, 'params'>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const initialQuery = route.params?.initialQuery || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        } else {
          setRecentSearches(['Oversized Tee', 'Linen', 'Sneakers']);
        }
      } catch (e) {
        console.warn('Failed to load search history', e);
      }
    };
    loadRecent();
  }, []);

  const saveRecentSearches = async (searches: string[]) => {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (e) {
      console.warn('Failed to save search history', e);
    }
  };

  const executeSearch = useCallback(
    async (searchTerm: string) => {
      const q = searchTerm.trim();
      if (!q) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await productService.filterAndSortProducts({
          searchQuery: q,
          limit: 30,
        });
        setResults(res.products);

        // Update search history
        setRecentSearches((prev) => {
          const filtered = prev.filter((item) => item.toLowerCase() !== q.toLowerCase());
          const updated = [q, ...filtered].slice(0, 10);
          saveRecentSearches(updated);
          return updated;
        });
      } catch (e) {
        console.warn('Search error', e);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Compute live suggestions as user types
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length >= 2) {
      productService.getAllProducts().then((all) => {
        const matchingTitles = all
          .filter((p) => p.name.toLowerCase().includes(q) || p.brandName.toLowerCase().includes(q))
          .map((p) => p.name)
          .slice(0, 5);
        setSuggestions(matchingTitles);
      });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleClearRecent = () => {
    setRecentSearches([]);
    saveRecentSearches([]);
  };

  const removeSingleRecent = (term: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== term);
      saveRecentSearches(updated);
      return updated;
    });
  };

  const handleSelectTerm = (term: string) => {
    setQuery(term);
    setSuggestions([]);
    executeSearch(term);
  };

  const hasSearched = query.trim().length > 0;

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Search Input Bar */}
      <View style={[styles.searchHeader, { paddingTop: insets.top + 8 }]}>
        <Input
          placeholder="Search brands, styles, fabrics..."
          value={query}
          onChangeText={(t) => {
            setQuery(t);
            if (!t.trim()) setResults([]);
          }}
          onSubmitEditing={() => executeSearch(query)}
          returnKeyType="search"
          leftIcon={<Ionicons name="search" size={20} color={COLORS.textMuted} />}
          onClear={() => {
            setQuery('');
            setResults([]);
            setSuggestions([]);
          }}
          containerStyle={styles.searchBarInput}
        />
        {hasSearched && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setQuery('');
              setResults([]);
              setSuggestions([]);
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Live Suggestions Overlay */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((s, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.suggestionItem}
              onPress={() => handleSelectTerm(s)}
            >
              <Ionicons name="search-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.suggestionText} numberOfLines={1}>
                {s}
              </Text>
              <Ionicons name="arrow-back" size={14} color={COLORS.textSubtle} style={styles.suggestArrow} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* If No Query Typed: Show Recent & Trending */}
      {!hasSearched ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>
                <TouchableOpacity onPress={handleClearRecent}>
                  <Text style={styles.clearRecentText}>Clear</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.chipsWrap}>
                {recentSearches.map((term, idx) => (
                  <View key={idx} style={styles.recentChip}>
                    <TouchableOpacity
                      onPress={() => handleSelectTerm(term)}
                      style={styles.recentChipTextContainer}
                    >
                      <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
                      <Text style={styles.recentChipText}>{term}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeSingleRecent(term)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons name="close" size={14} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Trending Searches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>TRENDING SEARCHES</Text>
            </View>

            <View style={styles.chipsWrap}>
              {TRENDING_KEYWORDS.map((kw, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.trendingChip}
                  onPress={() => handleSelectTerm(kw)}
                >
                  <Ionicons name="trending-up" size={14} color={COLORS.accent} />
                  <Text style={styles.trendingChipText}>{kw}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        /* Results View */
        <View style={styles.resultsContainer}>
          <View style={styles.resultsBar}>
            <Text style={styles.resultsCount}>
              {results.length} results for "{query}"
            </Text>
          </View>
          <ProductGrid
            products={results}
            loading={loading}
            emptyTitle={`No matches for "${query}"`}
            emptyMessage="Try searching for another keyword like 'shirt', 'denim', 'sneakers' or 'linen'."
            onEmptyAction={() => {
              setQuery('');
              setResults([]);
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingBottom: 8,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 10,
  },
  searchBarInput: {
    flex: 1,
    marginBottom: 0,
  },
  cancelBtn: {
    paddingVertical: 8,
  },
  cancelText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
  },
  suggestionsContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.base,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
    gap: 10,
  },
  suggestionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
  },
  suggestArrow: {
    transform: [{ rotate: '45deg' }],
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    padding: SPACING.base,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  clearRecentText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.rose,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  recentChipTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recentChipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  trendingChipText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  resultsBar: {
    paddingHorizontal: SPACING.base,
    paddingVertical: 10,
  },
  resultsCount: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textSecondary,
  },
});
