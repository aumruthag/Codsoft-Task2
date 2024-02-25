import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Share, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [showSavedQuotes, setShowSavedQuotes] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [quote, setQuote] = useState('Loading...');
  const [author, setAuthor] = useState('Loading...');

  const getRandomQuote = async () => {
    try {
      const response = await fetch("https://api.quotable.io/random");
      const result = await response.json();
      setQuote(result.content);
      setAuthor(result.author);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  const saveQuoteLocally = async (quote, author) => {
    try {
      const existingQuotes = (await AsyncStorage.getItem("quotes")) || "[]";
      const quotesArray = JSON.parse(existingQuotes);
      quotesArray.push({ quote, author });
      await AsyncStorage.setItem("quotes", JSON.stringify(quotesArray));
      loadSavedQuotes(); // Reload saved quotes after saving a new one
    } catch (error) {
      console.error("Error saving quote locally:", error);
    }
  };

  const loadSavedQuotes = async () => {
    try {
      const existingQuotes = await AsyncStorage.getItem("quotes");
      if (existingQuotes) {
        const quotesArray = JSON.parse(existingQuotes);
        setSavedQuotes(quotesArray);
      }
    } catch (error) {
      console.error("Error loading saved quotes:", error);
    }
  };

  const removeSavedQuote = async (index) => {
    try {
      const updatedQuotes = [...savedQuotes];
      updatedQuotes.splice(index, 1);
      setSavedQuotes(updatedQuotes);
      await AsyncStorage.setItem("quotes", JSON.stringify(updatedQuotes));
    } catch (error) {
      console.error("Error removing saved quote:", error);
    }
  };

  useEffect(() => {
    getRandomQuote();
    loadSavedQuotes();
  }, []);

  const tweetNow = () => {
    const url = "https://twitter.com/intent/tweet?text=" + quote;
    Share.share({
      message: quote,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Quotes App</Text>
      <View style={styles.quoteContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.quoteText}>{quote}</Text>
        <Text style={styles.authorText}>— {author}</Text>
        <TouchableOpacity
          onPress={() => {
            getRandomQuote();
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Get Another Quote</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => saveQuoteLocally(quote, author)} style={styles.greenButton}>
            <Text style={styles.buttonText}>Save Quote</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={tweetNow} style={styles.greenButton}>
            <Text style={styles.buttonText}>Share Quote</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSavedQuotes(!showSavedQuotes)} style={styles.greenButton}>
            <Text style={styles.buttonText}>View Saved Quotes</Text>
          </TouchableOpacity>
        </View>

        {showSavedQuotes && (
          <View style={styles.savedQuotesContainer}>
            <Text style={styles.savedQuotesHeader}>Saved Quotes</Text>
            {savedQuotes.map((item, index) => (
              <View key={index} style={styles.savedQuoteItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.savedQuoteText}>{item.quote}</Text>
                  <Text style={styles.savedQuoteAuthor}>{`- ${item.author}`}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C1FFC1', // Light Green color
  },
  quoteContainer: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: 'white', // Keep the container background color white
  },
  headerText: {
    textAlign: 'center',
    fontSize: 40,
    marginBottom: 20,
    marginTop: 30,
    fontWeight: 'bold',
    color: '#006400', // Dark Green color
  },
  quoteText: {
    color: '#000',
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: 1.1,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  authorText: {
    textAlign: 'right',
    fontWeight: '300',
    fontStyle: 'italic',
    fontSize: 16,
    color: '#000',
  },
  button: {
    padding: 20,
    borderRadius: 30,
    marginVertical: 20,
    backgroundColor: '#32CD32', // Lime Green color
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  greenButton: {
    borderRadius: 30,
    padding: 15,
    flex: 1,
    backgroundColor: '#32CD32', // Lime Green color
    margin: 5,
  },
  savedQuotesContainer: {
    marginTop: 20,
  },
  savedQuotesHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  savedQuoteItem: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedQuoteText: {
    fontSize: 16,
    color: '#333',
  },
  savedQuoteAuthor: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
  },
});

export default App;

