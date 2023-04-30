import React,{useState,useEffect} from "react";
import { View, Text,TextInput, ScrollView,StyleSheet,Pressable } from "react-native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("english1.db");
import { FontAwesome } from "@expo/vector-icons";
import { color } from "react-native-reanimated";
const SimilarWords = props => {
    const [page, setPage] = useState(props.route.params.page);
    const [countPage, setCountPage] = useState(props.route.params.countPage);
    const [goTo,setGoTo] = useState(0);
    const [disableButtons,setDisableButtons] = useState(false);
    const [disableNext,setDisableNext] = useState(false);
    const [disablePrevious,setDisablePrevious] = useState(false);
    const [nextOpacity,setNextOpacity] = useState(1);
    const [previousOpacity,setPreviousOpacity] = useState(1);
    const [words, setWords] = useState([
      {
        word: "",
        translation: "",
        id: 1,
      },
      {
        word: "",
        translation: "",
        id: 2,
      },
      {
        word: "",
        translation: "",
        id: 3,
      },
      {
        word: "",
        translation: "",
        id: 4,
      },
      {
        word: "",
        translation: "",
        id: 5,
      }
    ]);
    // const start = (props.route.params.lesson - 1) * 20;
    const start = (page - 1) * 9;
    // props.route.params.setWordPage(props.route.params.lesson);
   if(page == countPage && !disableNext)
    {
      setDisableNext(true);
      setNextOpacity(0.5)
    }
    else if(page < countPage && disableNext)
    {
      setDisableNext(false);
      setNextOpacity(1)
    }

   if(page == 1 && !disablePrevious)
      {
        setDisablePrevious(true);
        setPreviousOpacity(0.5);
      }
   else if(page > 1 && disablePrevious)
     {
       setDisablePrevious(false);
       setPreviousOpacity(1);
     }
   useEffect(() => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM similar_words ORDER BY orderIndex LIMIT 9 OFFSET ${start}`,
          null,
          (txObj, resultSet) => {
            if (resultSet.rows._array.length == 0)
            {
                setPage(page - 1)
            }
            else
            {
               setWords([...resultSet.rows._array]);
            }
            setDisableButtons(false);
          },
          (error) => console.log(error)
        );
      });

      // db.transaction((tx) => {
      //   tx.executeSql(
      //     `SELECT * FROM words ORDER BY orderIndex`,
      //     null,
      //     (txObj, resultSet) => {
      //        const countWords = resultSet.rows._array.length;
      //        const countPage = Math.ceil(countWords/5);
      //        setCountPage(countPage);
      //     },
      //     (error) => console.log(error)
      //   );
      // });
   },[page]);
   const bookmark = (index) => {
    var newWords = [...words];
    newWords[index].bookmark = !newWords[index].bookmark;
    const id = newWords[index].id;
    const bookmark = newWords[index].bookmark;
    setWords(newWords);
       db.transaction((tx) => {
         tx.executeSql(
           `UPDATE similar_words SET bookmark=? WHERE id=${id}`,
           [bookmark],
           (txObj, resultSet) => console.log(resultSet),
           (error) => console.log(error)
         );
       });

   }
   const goToPage = () => {
      if(!goToPage)
        console.log('ok')
   }
   const updateCurrentPage = (targetPage) => {
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE other SET value=? WHERE key='current_similar_page'`,
          [targetPage],
          (txObj, resultSet) => console.log(resultSet),
          (txObj, error) => console.log(error)
        );
      });
   }

   const increaseReview = (index) => {
      var newWords = [...words];
      newWords[index].review++;
      const review = newWords[index].review;
      const id = newWords[index].id;
      setWords(newWords);
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE similar_words SET review=? WHERE id=${id}`,
          [review],
          (txObj, resultSet) => console.log(resultSet),
          (error) => console.log(error)
        );
      });
   }

    const showWords = () => {
        return words.map((item,index) => {
            var color = undefined;
            if(item.bookmark)
              color = "#220c5c";
            else
              color = "#e5e1ed";

            if (index == 0)
               var borderTopRadius = 10;
            else
               var borderTopRadius = 0;

            if(index+1 == words.length)
               var borderBottomRadius = 10;
            else
               var borderBottomRadius = 0;
            return (
              <View
                style={[
                  styles.box,
                  {
                    borderBottomLeftRadius: borderBottomRadius,
                    borderBottomRightRadius: borderBottomRadius,
                    borderTopRightRadius:borderTopRadius,
                    borderTopLeftRadius:borderTopRadius
                  },
                ]}
                key={item.id}
              >
                {/* <Pressable onPress={() => increaseReview(index)}>
                  <Text style={styles.counter}>{item.review} مرور</Text>
                </Pressable> */}
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.translation}>{item.translation}</Text>
                {/* <Pressable onPress={() => bookmark(index)}>
                  <FontAwesome style={{marginStart:6}} name="bookmark" size={30} color={color} />
                </Pressable> */}
              </View>
            );
        })
    }
    return (
      <ScrollView
        style={{
          backgroundColor: "#220c5c",
          paddingStart: 10,
          paddingEnd: 10,
          paddingTop: 20,
        }}
      >
        <View style={styles.container}>
          <View style={styles.searchBox}>
            <TextInput
              returnKeyType="go"
              style={[styles.searchInput, { textAlign: "center" }]}
              keyboardType="numeric"
              placeholder="برو به صفحه"
              value={goTo}
              onChangeText={(value) => setGoTo(value)}
              onSubmitEditing={() => {
                    var page = parseInt(goTo);
                    console.log(page);
                if(page && page > countPage)
                   page = countPage;
                else if(!page || page < 1)
                   page = 1
                updateCurrentPage(page);
                setPage(page);
                props.route.params.setPage(page);
                setGoTo();
              }}
            ></TextInput>
            <Pressable
              style={styles.searchButton}
              onPress={() => {
                var page = parseInt(goTo);
                if (page > countPage)
                   page = countPage;
                else if (page < 1 || page == NaN)
                page = 1;
                updateCurrentPage(page);
                setPage(page);
                props.route.params.setPage(page);
                setGoTo();
              }}
            >
              <Text style={{ fontFamily: "Vazir" }}>برو</Text>
            </Pressable>
          </View>
          {showWords()}
          <Pressable
            disabled={disableButtons || disablePrevious}
            style={[styles.lastPage, { opacity: previousOpacity }]}
            onPress={() => {
              var targetPage = page;
              if (page != 1) targetPage--;
              updateCurrentPage(targetPage);
              setPage(targetPage);
              props.route.params.setPage(targetPage);
              setDisableButtons(true);
            }}
          >
            <Text style={{ fontFamily: "Vazir" }}>صفحه قبل</Text>
          </Pressable>
          <Text style={styles.pageNumber}>{Number.parseInt(page)}</Text>
          <Pressable
            disabled={disableButtons || disableNext}
            style={[styles.nextPage,{opacity:nextOpacity}]}
            onPress={() => {
              var targetPage = page;
              targetPage++;
              updateCurrentPage(targetPage);
              setPage(targetPage);
              props.route.params.setPage(targetPage);
              setDisableButtons(true);
            }}
          >
            <Text style={{ fontFamily: "Vazir" }}>صفحه بعد</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
}

export default SimilarWords;

const styles = StyleSheet.create({
  searchBox: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-evenly",
    marginBottom: 5,
  },
  searchInput: {
    backgroundColor: "#fff",
    color: "#000",
    width: "89%",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    fontFamily: "Vazir",
    paddingRight:6
  },
  searchButton: {
    width: "10%",
    marginEnd: "1%",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  pageNumber: {
    flex: 2,
    paddingTop: 14,
    textAlign: "center",
    color: "white",
    fontFamily: "Vazir",
    fontSize: 20,
  },
  lastPage: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginStart: 0,
    marginEnd: 4,
    padding: 9,
    flex: 1,
    borderColor: "navy",
    borderWidth: 1,
    borderRadius: 10,
  },
  nextPage: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginStart: 4,
    marginEnd: 0,
    padding: 9,
    flex: 1,
    borderColor: "navy",
    borderWidth: 1,
    borderRadius: 10,
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
    padding: 7,
    width: "100%",
  },
});