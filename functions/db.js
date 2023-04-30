import * as SQLite from "expo-sqlite";
import NetInfo from "@react-native-community/netinfo";
const db = SQLite.openDatabase("english1.db");
class Db {
  constructor(name, year) {

  }

  getMessages(props){
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
    fetch(`http://mscenglish.ir/api/messages`, {
      method: "GET",
      //Request Type
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const messages = responseJson.data;
        messages.forEach((message, index) => {
          db.transaction((tx) => {
            tx.executeSql(
              `SELECT id FROM messages WHERE id=${message.id}`,
              null,
              (txObj, resultSet) => {
                if (resultSet.rows.length && message.deleted_at == null) {
                  db.transaction((tx) => {
                    tx.executeSql(
                      `UPDATE messages SET title=?,text=? WHERE id=${message.id}`,
                      [message.title, message.text],
                      (txObj, resultSet) => {
                        console.log(`message ${message.id} updated`);
                      },
                      (txObj, error) => console.log(error)
                    );
                  });
                } else if (resultSet.rows.length) {
                  db.transaction((tx) => {
                    tx.executeSql(
                      `DELETE FROM messages WHERE id=${message.id}`,
                      null,
                      (txObj, resultSet) => {
                        console.log(`message ${message.id} deleted`);
                      },
                      (txObj, error) => console.log(error)
                    );
                  });
                } else if (
                  !resultSet.rows.length &&
                  message.deleted_at == null
                ) {
                  db.transaction((tx) => {
                    tx.executeSql(
                      `INSERT INTO messages(id,title,text) VALUES(?,?,?)`,
                      [message.id, message.title, message.text],
                      (txObj, resultSet) => {
                        console.log(`message ${message.id} created`);
                      },
                      (txObj, error) => console.log(error)
                    );
                  });
                }
              },
              (txObj, error) => console.log(error)
            );
          });
        });
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM messages where read=0",
            null,
            (txObj, resultSet) => {
              props.setNewMessagesCount(resultSet.rows.length);
            },
            (txObj, error) => console.log(error)
          );
        });
      });
    }
    else
    {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM messages where read=0",
          null,
          (txObj, resultSet) => {
            props.setNewMessagesCount(resultSet.rows.length);
          },
          (txObj, error) => console.log(error)
        );
      });
    }

  });
  }
  createDb() {
    new Promise((resolve,reject) => {
      //    db.transaction((tx) => {
      //      tx.executeSql(
      //        "DROP TABLE other",
      //        null,
      //        (txObj, resultSet) => console.log("other drop"),
      //        (error) => console.log(error)
      //      );
      //    });
      //    db.transaction((tx) => {
      //      tx.executeSql(
      //        "DROP TABLE words",
      //        null,
      //        (txObj, resultSet) => console.log("other drop"),
      //        (error) => console.log(error)
      //      );
      //    });
        //  db.transaction((tx) => {
        //    tx.executeSql(
        //      "DROP TABLE reading_questions",
        //      null,
        //      (txObj, resultSet) => console.log("reading questions drop"),
        //      (error) => console.log(error)
        //    );
        //  });
        // db.transaction((tx) => {
        //   tx.executeSql(
        //     "CREATE TABLE IF NOT EXISTS grammars (id INTEGER PRIMARY KEY, title VARCHAR(255),text TEXT)",
        //     null,
        //     (txObj, resultSet) => console.log("grammars create"),
        //     (txObj, error) => console.log(error)
        //   );
        // });
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT name FROM sqlite_master WHERE name='other' OR name='words' OR name='similar_words' OR name='word_tests' OR name='word_questions' OR name='word_answers' OR name='reading_tests' OR name='readings' OR name='reading_questions' OR name='reading_answers' OR name='messages'",
          null,
          (txObj, resultSet) => {
            if (resultSet.rows.length < 11) {
              db.transaction((tx) => {
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS other (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT,value TEXT)",
                  null,
                  (txObj, resultSet) => console.log("other create"),
                  (error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY, word TEXT,translation TEXT,orderIndex INTEGER,bookmark INTEGER DEFAULT 0,review INTEGER DEFAULT 0,deleted_at TIMESTAMP NULLABLE)",
                  null,
                  (txObj, resultSet) => console.log("words create"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS similar_words (id INTEGER PRIMARY KEY, word TEXT,translation TEXT,orderIndex INTEGER,bookmark INTEGER DEFAULT 0,review INTEGER DEFAULT 0,deleted_at TIMESTAMP NULLABLE)",
                  null,
                  (txObj, resultSet) => console.log("similar_words create"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS word_tests (id INTEGER PRIMARY KEY, title TEXT,orderIndex INTEGER,deleted_at TIMESTAMP NULLABLE)",
                  null,
                  (txObj, resultSet) => console.log("word_tests create"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS word_questions (id INTEGER PRIMARY KEY,test_id INTEGER ,question TEXT,translate TEXT,orderIndex INTEGER,deleted_at TIMESTAMP NULLABLE)",
                  null,
                  (txObj, resultSet) => console.log("word_questions create"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS word_answers (id INTEGER PRIMARY KEY,question_id INTEGER ,text TEXT,translate TEXT,status BOOLEAN,deleted_at TIMESTAMP NULLABLE)",
                  null,
                  (txObj, resultSet) => console.log("word_answers create"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS reading_tests (id INTEGER PRIMARY KEY, title TEXT,orderIndex INTEGER,deleted_at TIMESTAMP NULLABLE)",
                  null,
                  (txObj, resultSet) => console.log("reading_tests create"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS readings (id INTEGER PRIMARY KEY,test_id INTEGER,text TEXT, translate TEXT,orderIndex INTEGER,deleted_at TIMESTAMP NULLABLE)",
                  null,
                  (txObj, resultSet) => console.log("readings create"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS reading_questions (id INTEGER PRIMARY KEY,reading_id INTEGER ,question TEXT,translate TEXT,solve TEXT NULLABLE,orderIndex INTEGER,deleted_at TIMESTAMP NULLABLE)",
                  null,
                  (txObj, resultSet) => console.log("reading_questions create"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS reading_answers (id INTEGER PRIMARY KEY,question_id INTEGER ,text TEXT,translate TEXT,status BOOLEAN,deleted_at TIMESTAMP NULLABLE)",
                  null,
                  (txObj, resultSet) => console.log("reading_answers create"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY,title VARCHAR(255) ,text TEXT,read BOOLEAN DEFAULT 0,deleted_at TIMESTAMP NULLABLE)",
                  null,
                  (txObj, resultSet) => console.log("messages create"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "INSERT INTO other (key,value) VALUES(?,?)",
                  ["WordTestTutorial", ""],
                  (txObj, resultSet) =>
                    console.log("word test tutorial inserted"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "INSERT INTO other (key,value) VALUES(?,?)",
                  ["PassageTestTutorial", ""],
                  (txObj, resultSet) =>
                    console.log("passage test tutorial inserted"),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "INSERT INTO other (key,value) VALUES(?,?)",
                  ["current_page", 1],
                  (txObj, resultSet) => console.log(resultSet),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "INSERT INTO other (key,value) VALUES(?,?)",
                  ["current_bookmark_page", 1],
                  (txObj, resultSet) => console.log(resultSet),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "INSERT INTO other (key,value) VALUES(?,?)",
                  ["current_similar_page", 1],
                  (txObj, resultSet) => console.log(resultSet),
                  (txObj, error) => console.log(error)
                );
              });
              db.transaction((tx) => {
                tx.executeSql(
                  "INSERT INTO other(key,value) VALUES(?,?)",
                  ["Planning", "در حال بارگیری اطلاعات..."],
                  (txObj, resultSet) => console.log(resultSet),
                  (txObj, error) => console.log(error)
                );
              });
            }
          },
          (txObj, error) => console.log(error)
        );
      });
    })

    NetInfo.fetch().then((state) => {
      console.log("First, is " + (state.isConnected ? "online" : "offline"));
      if (state.isConnected) {
        fetch(`http://mscenglish.ir/api/words?paginate=20`, {
          method: "GET",
          //Request Type
        })
          .then((response) => response.json())
          //If response is in json then in success
          .then((responseJson) => {
            const countPages = responseJson.data.last_page;
            db.transaction((tx) => {
              tx.executeSql(
                `UPDATE other SET value='${countPages}' WHERE key="total_lesson"`,
                null,
                (txObj, resultSet) => console.log(resultSet),
                (txObj, error) => console.log(error)
              );
            });
            fetch(`http://mscenglish.ir/api/words?flag=all`, {
              method: "GET",
              //Request Type
            })
              .then((response) => response.json())
              .then((responseJson) => {
                //Success
                var q = `INSERT INTO words (id,word,translation,orderIndex,deleted_at) VALUES `;
                responseJson.data.forEach((item, index) => {
                  //    console.log(index);
                  q +=
                    `(` +
                    item.id +
                    `,"` +
                    item.word +
                    `","` +
                    item.translation +
                    `",` +
                    item.orderIndex +
                    `,` +
                    item.deleted_at +
                    `),`;
                  db.transaction((tx) => {
                    tx.executeSql(
                      `SELECT * FROM words WHERE id=${item.id}`,
                      null,
                      (txObj, resultSet) => {
                        if (resultSet.rows.length) {
                          db.transaction((tx) => {
                            tx.executeSql(
                              `UPDATE words SET word=?,translation=?,orderIndex=?,deleted_at=? WHERE id=${item.id}`,
                              [
                                item.word,
                                item.translation,
                                item.orderIndex,
                                item.deleted_at,
                              ],
                              (txObj, resultSet) => {
                                console.log(`${item.id} update`);
                              },
                              (txObj, error) => console.log(error)
                            );
                          });
                        } else {
                          db.transaction((tx) => {
                            tx.executeSql(
                              `INSERT INTO words(id,word,translation,orderIndex,deleted_at) VALUES(?,?,?,?,?)`,
                              [
                                item.id,
                                item.word,
                                item.translation,
                                item.orderIndex,
                                item.deleted_at,
                              ],
                              (txObj, resultSet) => {
                                console.log(`${item.id} create`);
                              },
                              (txObj, error) => console.log(error)
                            );
                          });
                        }
                      },
                      (txObj, error) => console.log(error)
                    );
                  });
                });
                // q = q.substring(0, q.length - 1);
                // q +=" ON DUPLICATE KEY UPDATE word = VALUES(word), translation = VALUES(translation),orderIndex = VALUES(orderIndex),deleted_at = VALUES(deleted_at);";
                //   console.log(q);

                //
                // db.transaction((tx) => {
                //   tx.executeSql(
                //     q,
                //     null,
                //     (txObj, resultSet) =>
                //       console.log(resultSet),
                //     (txObj, error) => console.log(error)
                //   );
                // });
              });
          })
          //If response is not in json then in error
          .catch((error) => {
            //Error
            console.error(error);
          });

          fetch(`http://mscenglish.ir/api/similar-words?flag=all`, {
            method: "GET",
            //Request Type
          })
            .then((response) => response.json())
            .then((responseJson) => {
              //Success
              responseJson.data.forEach((item, index) => {
                db.transaction((tx) => {
                  tx.executeSql(
                    `SELECT * FROM similar_words WHERE id=${item.id}`,
                    null,
                    (txObj, resultSet) => {
                      if (resultSet.rows.length) {
                        db.transaction((tx) => {
                          tx.executeSql(
                            `UPDATE similar_words SET word=?,translation=?,orderIndex=?,deleted_at=? WHERE id=${item.id}`,
                            [
                              item.word,
                              item.translation,
                              item.orderIndex,
                              item.deleted_at,
                            ],
                            (txObj, resultSet) => {
                              console.log(`${item.id} update`);
                            },
                            (txObj, error) => console.log(error)
                          );
                        });
                      } else {
                        db.transaction((tx) => {
                          tx.executeSql(
                            `INSERT INTO similar_words(id,word,translation,orderIndex,deleted_at) VALUES(?,?,?,?,?)`,
                            [
                              item.id,
                              item.word,
                              item.translation,
                              item.orderIndex,
                              item.deleted_at,
                            ],
                            (txObj, resultSet) => {
                              console.log(`${item.id} create`);
                            },
                            (txObj, error) => console.log(error)
                          );
                        });
                      }
                    },
                    (txObj, error) => console.log(error)
                  );
                });
              });
            });



            //grammar section

            fetch(`http://mscenglish.ir/api/grammars`, {
              method: "GET",
              //Request Type
            })
              .then((response) => response.json())
              .then((responseJson) => {
                //Success
                responseJson.data.forEach((grammar, index) => {
                  db.transaction((tx) => {
                    tx.executeSql(
                      `SELECT * FROM grammars WHERE id=${grammar.id}`,
                      null,
                      (txObj, resultSet) => {
                        if (resultSet.rows.length) {
                          if(grammar.deleted_at == null)
                          {
                          db.transaction((tx) => {
                            tx.executeSql(
                              `UPDATE grammars SET title=?,text=? WHERE id=${grammar.id}`,
                              [
                                grammar.title,
                                grammar.text,
                              ],
                              (txObj, resultSet) => {
                                console.log(`${grammar.id} update`);
                              },
                              (txObj, error) => console.log(error)
                            );
                          });
                        }else{
                          db.transaction((tx) => {
                            tx.executeSql(
                              `DELETE FROM grammars WHERE id=${grammar.id}`,
                              [],
                              (txObj, resultSet) => {
                                console.log(`${grammar.id} deleted`);
                              },
                              (txObj, error) => console.log(error)
                            );
                          });
                        }
                        } else if(grammar.deleted_at == null) {
                          db.transaction((tx) => {
                            tx.executeSql(
                              `INSERT INTO grammars(id,title,text) VALUES(?,?,?)`,
                              [
                                grammar.id,
                                grammar.title,
                                grammar.text,
                              ],
                              (txObj, resultSet) => {
                                console.log(`${grammar.id} create`);
                              },
                              (txObj, error) => console.log(error)
                            );
                          });
                        }
                      },
                      (txObj, error) => console.log(error)
                    );
                  });
                });
              });

        //word test section
        fetch(`http://mscenglish.ir/api/word-tests`, {
          method: "GET",
          //Request Type
        })
          .then((response) => response.json())
          .then((responseJson) => {
            //Success
            responseJson.data.forEach((item, index) => {
              db.transaction((tx) => {
                tx.executeSql(
                  `SELECT * FROM word_tests WHERE id=${item.id}`,
                  null,
                  (txObj, resultSet) => {
                    if (resultSet.rows.length) {
                      db.transaction((tx) => {
                        tx.executeSql(
                          `UPDATE word_tests SET title=?,orderIndex=?,deleted_at=? WHERE id=${item.id}`,
                          [
                            item.title,
                            item.orderIndex,
                            item.deleted_at,
                          ],
                          (txObj, resultSet) => {
                            console.log(`word test ${item.id} update`);
                          },
                          (txObj, error) => console.log(error)
                        );
                      });

                    } else {
                      db.transaction((tx) => {
                        tx.executeSql(
                          `INSERT INTO word_tests(id,title,orderIndex,deleted_at) VALUES(?,?,?,?)`,
                          [
                            item.id,
                            item.title,
                            item.orderIndex,
                            item.deleted_at,
                          ],
                          (txObj, resultSet) => {
                            console.log(`word test ${item.id} create`);
                          },
                          (txObj, error) => console.log(error)
                        );
                      });
                    }
                  },
                  (txObj, error) => console.log(error)
                );
              });
              item.questions.forEach((question, index) => {
                db.transaction((tx) => {
                  tx.executeSql(
                    `SELECT * FROM word_questions WHERE id=${question.id}`,
                    null,
                    (txObj, resultSet) => {
                      if (resultSet.rows.length) {
                        db.transaction((tx) => {
                          tx.executeSql(
                            `UPDATE word_questions SET test_id=?,question=?,translate=?,orderIndex=?,deleted_at=? WHERE id=${question.id}`,
                            [
                              question.foreign_id,
                              question.question,
                              question.translate,
                              question.orderIndex,
                              question.deleted_at,
                            ],
                            (txObj, resultSet) => {
                              console.log(`word question ${question.id} update`);
                            },
                            (txObj, error) => console.log(error)
                          );
                        });
                      } else {
                        db.transaction((tx) => {
                          tx.executeSql(
                            `INSERT INTO word_questions(id,test_id,question,translate,orderIndex,deleted_at) VALUES(?,?,?,?,?,?)`,
                            [
                              question.id,
                              question.foreign_id,
                              question.question,
                              question.translate,
                              question.orderIndex,
                              question.deleted_at,
                            ],
                            (txObj, resultSet) => {
                              console.log(`word question ${question.id} create`);
                            },
                            (txObj, error) => console.log(error)
                          );
                        });
                      }
                    },
                    (txObj, error) => console.log(error)
                  );
                });
                question.answers.forEach((answer, index) => {
                  db.transaction((tx) => {
                    tx.executeSql(
                      `SELECT * FROM word_answers WHERE id=${answer.id}`,
                      null,
                      (txObj, resultSet) => {
                        if (resultSet.rows.length) {
                          db.transaction((tx) => {
                            tx.executeSql(
                              `UPDATE word_answers SET text=?,translate=?,status=?,deleted_at=? WHERE id=${answer.id}`,
                              [
                                answer.text,
                                answer.translate,
                                answer.status,
                                answer.deleted_at,
                              ],
                              (txObj, resultSet) => {
                                console.log(`word answer ${answer.id} update`);
                              },
                              (txObj, error) => console.log(error)
                            );
                          });
                        } else {
                          db.transaction((tx) => {
                            tx.executeSql(
                              `INSERT INTO word_answers(id,question_id,text,translate,status,deleted_at) VALUES(?,?,?,?,?,?)`,
                              [
                                answer.id,
                                answer.question_id,
                                answer.text,
                                answer.translate,
                                answer.status,
                                answer.deleted_at,
                              ],
                              (txObj, resultSet) => {
                                console.log(`word answer ${answer.id} create`);
                              },
                              (txObj, error) => console.log(error)
                            );
                          });
                        }
                      },
                      (txObj, error) => console.log(error)
                    );
                  });
                });
              });
            });
          });



        //reading test section
        fetch(`http://mscenglish.ir/api/reading-tests`, {
          method: "GET",
          //Request Type
        })
          .then((response) => response.json())
          .then((responseJson) => {
            //Success
            responseJson.data.forEach((item, index) => {
              db.transaction((tx) => {
                tx.executeSql(
                  `SELECT * FROM reading_tests WHERE id=${item.id}`,
                  null,
                  (txObj, resultSet) => {
                    if (resultSet.rows.length) {
                      db.transaction((tx) => {
                        tx.executeSql(
                          `UPDATE reading_tests SET title=?,orderIndex=?,deleted_at=? WHERE id=${item.id}`,
                          [item.title, item.orderIndex, item.deleted_at],
                          (txObj, resultSet) => {
                            console.log(`reading test ${item.id} update`);
                          },
                          (txObj, error) => console.log(error)
                        );
                      });
                    } else {
                      db.transaction((tx) => {
                        tx.executeSql(
                          `INSERT INTO reading_tests(id,title,orderIndex,deleted_at) VALUES(?,?,?,?)`,
                          [
                            item.id,
                            item.title,
                            item.orderIndex,
                            item.deleted_at,
                          ],
                          (txObj, resultSet) => {
                            console.log(`reading test ${item.id} create`);
                          },
                          (txObj, error) => console.log(error)
                        );
                      });
                    }
                  },
                  (txObj, error) => console.log(error)
                );
              });
              item.readings.forEach((reading,index) => {
                db.transaction((tx) => {
                  tx.executeSql(
                    `SELECT * FROM readings WHERE id=${reading.id}`,
                    null,
                    (txObj, resultSet) => {
                      if (resultSet.rows.length) {
                        db.transaction((tx) => {
                          tx.executeSql(
                            `UPDATE readings SET test_id=?,text=?,translate=?,orderIndex=?,deleted_at=? WHERE id=${reading.id}`,
                            [
                              reading.test_id,
                              reading.text,
                              reading.translate,
                              reading.orderIndex,
                              reading.deleted_at,
                            ],
                            (txObj, resultSet) => {
                              console.log(
                                `reading ${reading.id} update`
                              );
                            },
                            (txObj, error) => console.log(error)
                          );
                        });
                      } else {
                        db.transaction((tx) => {
                          tx.executeSql(
                            `INSERT INTO readings(id,test_id,text,translate,orderIndex,deleted_at) VALUES(?,?,?,?,?,?)`,
                            [
                              reading.id,
                              reading.test_id,
                              reading.text,
                              reading.translate,
                              reading.orderIndex,
                              reading.deleted_at,
                            ],
                            (txObj, resultSet) => {
                              console.log(
                                `reading ${reading.id} create`
                              );
                            },
                            (txObj, error) => console.log(error)
                          );
                        });
                      }
                    },
                    (txObj, error) => console.log(error)
                  );
                });
                 reading.questions.forEach((question, index) => {
                   db.transaction((tx) => {
                     tx.executeSql(
                       `SELECT * FROM reading_questions WHERE id=${question.id}`,
                       null,
                       (txObj, resultSet) => {
                         if (resultSet.rows.length) {
                           db.transaction((tx) => {
                             tx.executeSql(
                               `UPDATE reading_questions SET reading_id=?,question=?,translate=?,solve=?,orderIndex=?,deleted_at=? WHERE id=${question.id}`,
                               [
                                 question.foreign_id,
                                 question.question,
                                 question.translate,
                                 question.solve,
                                 question.orderIndex,
                                 question.deleted_at,
                               ],
                               (txObj, resultSet) => {
                                 console.log(`reading question ${question.id} update`);
                               },
                               (txObj, error) => console.log(error)
                             );
                           });
                         } else {
                           db.transaction((tx) => {
                             tx.executeSql(
                               `INSERT INTO reading_questions(id,reading_id,question,translate,solve,orderIndex,deleted_at) VALUES(?,?,?,?,?,?,?)`,
                               [
                                 question.id,
                                 question.foreign_id,
                                 question.question,
                                 question.translate,
                                 question.solve,
                                 question.orderIndex,
                                 question.deleted_at,
                               ],
                               (txObj, resultSet) => {
                                 console.log(`reading question ${question.id} create`);
                               },
                               (txObj, error) => console.log(error)
                             );
                           });
                         }
                       },
                       (txObj, error) => console.log(error)
                     );
                   });
                   question.answers.forEach((answer, index) => {
                     db.transaction((tx) => {
                       tx.executeSql(
                         `SELECT * FROM reading_answers WHERE id=${answer.id}`,
                         null,
                         (txObj, resultSet) => {
                           if (resultSet.rows.length) {
                             db.transaction((tx) => {
                               tx.executeSql(
                                 `UPDATE reading_answers SET text=?,translate=?,status=?,deleted_at=? WHERE id=${answer.id}`,
                                 [
                                   answer.text,
                                   answer.translate,
                                   answer.status,
                                   answer.deleted_at,
                                 ],
                                 (txObj, resultSet) => {
                                   console.log(`reading answer ${answer.id} update`);
                                 },
                                 (txObj, error) => console.log(error)
                               );
                             });
                           } else {
                             db.transaction((tx) => {
                               tx.executeSql(
                                 `INSERT INTO reading_answers(id,question_id,text,translate,status,deleted_at) VALUES(?,?,?,?,?,?)`,
                                 [
                                   answer.id,
                                   answer.question_id,
                                   answer.text,
                                   answer.translate,
                                   answer.status,
                                   answer.deleted_at,
                                 ],
                                 (txObj, resultSet) => {
                                   console.log(`reading answer ${answer.id} create`);
                                 },
                                 (txObj, error) => console.log(error)
                               );
                             });
                           }
                         },
                         (txObj, error) => console.log(error)
                       );
                     });
                   });
                 });
              });

            });
          });


        //support section

             fetch(`http://mscenglish.ir/api/support`, {
               method: "GET",
             })
               .then((response) => {
                 if (response.status == 200) return response.json();
                 else return { status: { code: 500 } };
               })
               .then((response) => {
                 if (response.status.code == 200) {
                   db.transaction((tx) => {
                     tx.executeSql(
                       "UPDATE other SET value=? WHERE key='Support'",
                       [response.data],
                       (txObj, resultSet) => console.log("Support updated"),
                       (txObj, error) => console.log(error)
                     );
                   });
                 }
               });


        //about section

         fetch(`http://mscenglish.ir/api/about`, {
           method: "GET",
         })
           .then((response) => {
             if (response.status == 200) return response.json();
             else return { status: { code: 500 } };
           })
           .then((response) => {
             if (response.status.code == 200) {
               setText(response.data);
               db.transaction((tx) => {
                 tx.executeSql(
                   "UPDATE other SET value=? WHERE key='About'",
                   [response.data],
                   (txObj, resultSet) => console.log("About updated"),
                   (txObj, error) => console.log(error)
                 );
               });
             }
           });
      }
    });

  }
}

module.exports = Db;
