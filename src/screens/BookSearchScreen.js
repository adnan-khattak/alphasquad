import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import GradientBackground from '../components/GradientBackground';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';

import { GutendexService } from '../utils/gutendexService';

const BookSearchScreen = ({ navigation }) => {
	const { colors } = useTheme();

	const [query, setQuery] = useState('harry potter');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const canSearch = useMemo(() => (query && query.trim().length >= 2), [query]);

    const performSearch = async () => {
		if (!canSearch) return;
		try {
			setLoading(true);
			setError(null);
            const items = await GutendexService.searchBooks(query);
            setResults(items);
		} catch (e) {
			setError(e.message || 'Search failed');
			setResults([]);
		} finally {
			setLoading(false);
		}
	};

    const openReader = (item) => {
        navigation.navigate('Read', { title: item.title, author: item.author, gutenbergId: item.gutenbergId, readUrl: item.readUrl });
    };

    const addToLibrary = async (item) => {
        try {
            // Estimate pages if null: default 300 (word-based estimation not available)
            const totalPages =  item.totalPages || 300;
            // Reuse BookService to store basic row; save metadata locally
            const { BookService } = await import('../utils/bookService');
            await BookService.addBook({
                title: item.title,
                author: item.author,
                coverImage: item.coverImage,
                totalPages,
                gutenbergId: item.gutenbergId,
                readUrl: item.readUrl,
                category: 'Other',
            });
        } catch (e) {
            setError(e.message || 'Failed to add book');
        }
    };

	const renderItem = ({ item }) => {
        const image = item.coverImage;
        const authors = item.author;
		return (
			<View style={[styles.card, { backgroundColor: colors.surface }]}> 
				{image ? (
					<Image source={{ uri: image }} style={styles.cover} resizeMode="cover" />
				) : (
					<View style={[styles.coverPlaceholder, { backgroundColor: colors.background }]}>
						<Ionicons name="book-outline" size={28} color={colors.textMuted} />
					</View>
				)}
				<View style={styles.cardBody}>
                    <Text numberOfLines={2} style={[styles.title, { color: colors.textPrimary }]}>{item.title || 'Untitled'}</Text>
                    <Text numberOfLines={1} style={[styles.subtitle, { color: colors.textSecondary }]}>{authors}</Text>
					<View style={styles.actionsRow}>
						<TouchableOpacity onPress={() => openReader(item)} style={[styles.readButton, { backgroundColor: colors.accent }]}>
							<Text style={[styles.readButtonText, { color: colors.background }]}>Read</Text>
						</TouchableOpacity>
                        <TouchableOpacity onPress={() => addToLibrary(item)} style={[styles.readButton, { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.accent }]}>
                            <Text style={[styles.readButtonText, { color: colors.accent }]}>Add</Text>
                        </TouchableOpacity>
					</View>
				</View>
			</View>
		);
	};

	return (
		<GradientBackground colors={[colors.gradientStart, colors.gradientEnd]}>
			<View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}> 
				<TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconButton, { backgroundColor: colors.background }]}> 
					<Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
				</TouchableOpacity>
				<Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Discover Books</Text>
				<View style={{ width: 36 }} />
			</View>

			<View style={styles.searchRow}>
				<View style={[styles.searchContainer, { backgroundColor: colors.surface }]}> 
					<Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: SPACING.sm }} />
					<TextInput
						style={[styles.searchInput, { color: colors.textPrimary }]}
						placeholder="Search online books..."
						placeholderTextColor={colors.textMuted}
						value={query}
						onChangeText={setQuery}
						returnKeyType="search"
						onSubmitEditing={performSearch}
					/>
					{query?.length > 0 && (
						<TouchableOpacity onPress={() => setQuery('')}>
							<Ionicons name="close-circle" size={18} color={colors.textMuted} />
						</TouchableOpacity>
					)}
				</View>
				<TouchableOpacity disabled={!canSearch || loading} onPress={performSearch} style={[styles.searchButton, { backgroundColor: canSearch && !loading ? colors.accent : colors.border }]}> 
					<Ionicons name="arrow-forward" size={18} color={canSearch && !loading ? colors.background : colors.textMuted} />
				</TouchableOpacity>
			</View>

			{loading ? (
				<View style={styles.centerWrap}>
					<ActivityIndicator color={colors.accent} />
					<Text style={{ marginTop: 8, color: colors.textSecondary }}>Searching…</Text>
				</View>
			) : error ? (
				<View style={styles.centerWrap}>
					<Ionicons name="alert-circle-outline" size={32} color={colors.error || colors.accent} />
					<Text style={{ marginTop: 8, color: colors.textSecondary }}>{error}</Text>
				</View>
			) : (
				<FlatList
                    data={results}
                    keyExtractor={(item) => String(item.gutenbergId)}
					renderItem={renderItem}
					contentContainerStyle={styles.list}
					keyboardShouldPersistTaps="handled"
				/>
			)}
		</GradientBackground>
	);
};

const styles = StyleSheet.create({
	header: {
		paddingHorizontal: SPACING.xl,
		paddingTop: SPACING.xl,
		paddingBottom: SPACING.md,
		borderBottomWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	headerTitle: {
		fontSize: FONT_SIZES.xl,
		fontWeight: '800',
		letterSpacing: -0.5,
	},
	iconButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	searchRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: SPACING.xl,
		marginTop: SPACING.lg,
		gap: SPACING.md,
	},
	searchContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: SPACING.md,
		borderRadius: BORDER_RADIUS.xl,
	},
	searchInput: {
		flex: 1,
		fontSize: FONT_SIZES.md,
	},
	searchButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: 'center',
		alignItems: 'center',
	},
	list: {
		paddingHorizontal: SPACING.xl,
		paddingTop: SPACING.lg,
		paddingBottom: 100,
		gap: SPACING.md,
	},
	card: {
		flexDirection: 'row',
		borderRadius: BORDER_RADIUS.lg,
		padding: SPACING.md,
		alignItems: 'center',
	},
	cover: {
		width: 56,
		height: 80,
		borderRadius: BORDER_RADIUS.md,
		marginRight: SPACING.md,
		backgroundColor: '#222',
	},
	coverPlaceholder: {
		width: 56,
		height: 80,
		borderRadius: BORDER_RADIUS.md,
		marginRight: SPACING.md,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cardBody: {
		flex: 1,
	},
	title: {
		fontSize: FONT_SIZES.md,
		fontWeight: '700',
		marginBottom: 2,
	},
	subtitle: {
		fontSize: FONT_SIZES.sm,
		marginBottom: SPACING.sm,
	},
	actionsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: SPACING.md,
	},
	readButton: {
		borderRadius: BORDER_RADIUS.lg,
		paddingHorizontal: SPACING.lg,
		paddingVertical: SPACING.sm,
	},
	readButtonText: {
		fontSize: FONT_SIZES.sm,
		fontWeight: '700',
	},
	centerWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: SPACING.xl,
	},
});

export default BookSearchScreen;



