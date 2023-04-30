import React,{useState} from "react";
import { View, Text, Pressable, Keyboard } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import * as SQLite from "expo-sqlite";
import { StyleSheet } from "react-native";
import { useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
const db = SQLite.openDatabase("english1.db");

const Search = (props) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [word,setWord] = useState('');
  const [close,setClose] = useState(1);
  const [submited,setSubmited] = useState(false);
  const [searchButtonClick, setSearchButtonClick] = useState(false);
  const [words,setWords] = useState([]);
  const [searchWord,setSearchWord] = useState('');
  const [resultWords,setResultWords] = useState([]);
  const [emptyResultText,setEmptyResultText] = useState('در حال جستجو...');
   const search = (str) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM words where word LIKE '%${str}%' LIMIT 5`,
        null,
        (txObj, resultSet) => {
          setResultWords([...resultSet.rows._array]);
        },
        (error) => console.log(error)
      );
    });
   }
    useEffect(() => {
      if(word == '')
      {
        setWords([]);
      }
      else
      {
     db.transaction((tx) => {
       tx.executeSql(
         `SELECT id,word as title,review,bookmark FROM words where word LIKE '%${word}%' LIMIT 10`,
         null,
         (txObj, resultSet) => {
           setWords([...resultSet.rows._array]);
           setEmptyResultText('موردی یافت نشد!');
           console.log(resultSet.rows._array.length);
         },
         (error) => console.log(error)
       );
     });
    }
    }, [word]);
const bookmark = (index) => {
  var newWords = [...resultWords];
  newWords[index].bookmark = !newWords[index].bookmark;
  const id = newWords[index].id;
  const bookmark = newWords[index].bookmark;
  setResultWords(newWords);
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE words SET bookmark=? WHERE id=${id}`,
      [bookmark],
      (txObj, resultSet) => console.log(resultSet),
      (error) => console.log(error)
    );
  });
};
    const increaseReview = (index) => {
      var newWords = [...resultWords];
      newWords[index].review++;
      const review = newWords[index].review;
      const id = newWords[index].id;
      setResultWords(newWords);
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE words SET review=? WHERE id=${id}`,
          [review],
          (txObj, resultSet) => console.log(resultSet),
          (error) => console.log(error)
        );
      });
    };

  const showWords = () => {
    return resultWords.map((item, index) => {
      var color = undefined;
      if (item.bookmark) color = "#220c5c";
      else color = "#e5e1ed";

      if (index == 0) var borderTopRadius = 10;
      else var borderTopRadius = 0;

      if (index + 1 == resultWords.length) var borderBottomRadius = 10;
      else var borderBottomRadius = 0;
      return (
        <View
          style={[
            styles.box,
            {
              borderBottomLeftRadius: borderBottomRadius,
              borderBottomRightRadius: borderBottomRadius,
              borderTopRightRadius: borderTopRadius,
              borderTopLeftRadius: borderTopRadius,
            },
          ]}
          key={item.id}
        >
          <Pressable onPress={() => increaseReview(index)}>
            <Text style={styles.counter}>{item.review} مرور</Text>
          </Pressable>
          <Text style={styles.word}>{item.word}</Text>
          <Text style={styles.translation}>{item.translation}</Text>
          <Pressable onPress={() => bookmark(index)}>
            <FontAwesome
              style={{ marginStart: 6 }}
              name="bookmark"
              size={30}
              color={color}
            />
          </Pressable>
        </View>
      );
    });
  };
  console.log("ist : ",word);
  console.log(words)
  return (
    <TouchableWithoutFeedback onPress={() => {
       Keyboard.dismiss();
       setSubmited(true)
      }}>
      <View style={styles.container}>
        <View style={styles.searchSection}>
          {/* <View style={styles.searchIcon}>
          <Pressable
            style={styles.searchButton}
            onPress={() => {
              setSearchButtonClick(true);
              // search(word);
            }}
          >
            <FontAwesome
              style={{ marginStart: 6 }}
              name="search"
              size={25}
              color={"#220c5c"}
            />
          </Pressable>
        </View> */}
          <View style={styles.searchInput}>
            <AutocompleteDropdown
              dataSet={words}
              clearOnFocus={false}
              blurOnSubmit={true}
              closeOnBlur={true}
              closeOnSubmit={true}
              clearOnSubmit={true}
              onFocus={() => setClose(0)}
              controller={(controller) => {
                // if (close) {
                //   controller.close();
                //   setClose(0);
                // }
              }}
              onSubmit={(e) => {
                search(word);
                setWords([]);
                setWord('');
                // setClose(1);
                setSubmited(true);
              }}
              textInputProps={
                (submited)
                  ? {
                      value: '',
                      returnKeyType: "search",
                    }
                  : { returnKeyType: "search"}
              }
              onSelectItem={(value) => {
                setSubmited(true);
                setWords([]);
                setWord('');
                search(value ? value.title : "");
                setWord(value ? value.title : "");
              }}
              suggestionsListMaxHeight={300}
              inputContainerStyle={{
                borderBottomRightRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 10,
                borderTopLeftRadius: 10,
                backgroundColor: "#fff",
              }}
              onChangeText={(value) => {
                // if (value == "" && !submited) setClose(1);
                // else setClose(0);
                setWord(value);
                setSubmited(false);
                setEmptyResultText("در حال جستجو...");
              }}
              EmptyResultComponent={
                word != '' ?
                <Text style={styles.emptyResult}>{emptyResultText}</Text> : <Text style={{display:'none'}}></Text>
              }
            />
          </View>
        </View>
        {showWords()}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#220c5c",
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 20,
    height: "100%",
  },
  searchSection: {
    display: "flex",
    flexDirection: "row-reverse",
    zIndex: 1000,
    marginBottom:3
  },
  searchInput: {
    flex: 5,
  },
  searchButton: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 5,
    paddingRight: 9,
    paddingLeft: 3,
    marginRight: 4,
    marginLeft: 4,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: "#fff",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  emptyResult: {
    textAlign: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  counter: {
    fontSize: 20,
    backgroundColor: "#220c5c",
    color: "white",
    borderRadius: 10,
    alignSelf: "flex-end",
    textAlign: "center",
    paddingEnd: 5,
    paddingStart: 5,
  },
  word: {
    paddingStart: 5,
    paddingEnd: 5,
    fontSize: 18,
    fontWeight: "500",
  },
  translation: {
    paddingStart: 5,
    paddingEnd: 5,
    fontSize: 15,
    fontFamily: "Vazir",
  },
  box: {
    backgroundColor: "white",
    marginBottom: 4,
    padding: 5,
    width: "100%",
  },
});
