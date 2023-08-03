import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("english1.db");
class WordModel {
    updateGroup(words) {
        var last_update;
        
        db.transaction((tx) => {
          tx.executeSql(
            `SELECT * FROM other WHERE key='last_updated_at'`,
            null,
            (txObj,resultSet) => {
                // console.log(resultSet.rows);
            },
            (txObj,error) => {
                console.log('error when try to get last updated_at',error);
            });
            words.forEach((item,index) => {
                console.log(item);
                last_update = item.updated_at;
                tx.executeSql(
                    `SELECT * FROM words WHERE id=${item.id}`,
                    null,
                    (txObj, resultSet) => {
                      if (resultSet.rows.length && !item.deleted_at) {
                          tx.executeSql(
                            `UPDATE words SET word=?,translation=?,orderIndex=?,deleted_at=? WHERE id=${item.id}`,
                            [
                              item.word,
                              item.translation,
                              item.orderIndex,
                              item.deleted_at,
                            ],
                            (txObj, resultSet) => {
                              // console.log(`${item.id} updated`);
                            },
                            (txObj, error) => console.log(error)
                          );
                      } else if(!item.deleted_at) {
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
                              // console.log(`${item.id} created`);
                            },
                            (txObj, error) => console.log(error)
                          );
                      }
                      else
                      {
                        tx.executeSql(
                          `DELETE FROM words WHERE id=${item.id})`,
                          [],
                          (txObj, resultSet) => {
                            // console.log(`${item.id} deleted`);
                          },
                          (txObj, error) => console.log(error)
                        );
                      }
                    },
                    (txObj, error) => console.log(error)
                  );
            });
            
        },(error) => {
          console.log('error transaction')
          return false;
        },
        () => {
          console.log(`${words.length} rows updated successfully`)
          return true;
          // db.transaction(tx => { 
          // tx.executeSql(
          //   `UPDATE other set value=? WHERE key='last_updated_at'`,
          //   [last_update],
          //   (txObj, resultSet) => {
          //     console.log(`last_updated_at update on ${last_update}`);
          //   },
          //   (txObj, error) => console.log('errorrrrrrrrrrrr',error)
          // );
          // });
        });
    }
}

module.exports = WordModel;