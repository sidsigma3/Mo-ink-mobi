import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";

const SelectState = ({ value, onChange }) => {
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
  ];

  const [query, setQuery] = useState(value || "");
  const [filteredStates, setFilteredStates] = useState([]);

  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value]);

  const handleInputChange = (q) => {
    setQuery(q);
    const matches = states.filter((state) =>
      state.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredStates(matches);
  };

  const handleSelect = (state) => {
    onChange(state);
    setQuery(state);
    setFilteredStates([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={handleInputChange}
        placeholder="Search state"
      />
      {filteredStates.length > 0 && query ? (
        <FlatList
          style={styles.dropdown}
          data={filteredStates}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dropdown: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 9999,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default SelectState;
