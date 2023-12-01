import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("english1.db");
class WordModel {
  constructor()
  {
     this.attemp = 0;    
  }
    test() {
    let getCurrentData = new Promise((resolve,reject) => {
       db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM other`,
          null,
          (txObj,resultSet) => {
              var otherArray = resultSet.rows._array;
              console.log('what?')
              for(var key in otherArray)
              {
                  switch(otherArray[key]['key'])
                  {
                    case 'last_updated_at':
                      this.last_updated_at = otherArray[key]['value'];
                      break;
                    case 'last_updated_page':
                      this.last_updated_page = otherArray[key]['value'];
                      break;
                    case 'current_updating_at':
                      this.current_updating_at = otherArray[key]['value'];
                      break;
                    default:
                      break;
                  }
              }
              resolve();
              // var last_updated_at = resultSet.rows._array[0]['value'];
          },
          (txObj,error) => {
              console.log('error when try to get last updated_at',error);
              reject();
          });
      });
    });
    
     getCurrentData.then(() => {
        // console.log(this.last_updated_at,this.last_updated_page,this.current_updating_at);
        this.getWords();
     }).catch(() => {
        console.log('error when get current data');
     });

    }
  
  getWords()
  {
    console.log(`get data page ${this.last_updated_page} ...`);
    fetch(`http://mscenglish.ir/api/app/words?page=67&lastUpdatedAt=${this.last_updated_at}&currentUpdatingAt=${this.current_updating_at}`, {
      method: "GET",
      //Request Type
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Success
        console.log("status code : ",responseJson.status.code);
        console.log("status title : ",responseJson.status.title);
        console.log("errors : ",responseJson.errors);
        console.log("currentUpdatingAt : ",responseJson.data.currentUpdatingAt);
        console.log("current_page : ",responseJson.data.words.current_page);
        console.log("first_page_url : ",responseJson.data.words.first_page_url);
        console.log("from : ",responseJson.data.words.from);
        console.log("last_page : ",responseJson.data.words.last_page);
        console.log("last_page_url : ",responseJson.data.words.last_page_url);
        // console.log("links : ",responseJson.data.words.links);
        console.log("next_page_url : ",responseJson.data.words.next_page_url);
        console.log("path : ",responseJson.data.words.path);
        console.log("per_page : ",responseJson.data.words.per_page);
        console.log("prev_page_url : ",responseJson.data.words.prev_page_url);
        console.log("to : ",responseJson.data.words.to);
        console.log("total : ",responseJson.data.words.total);
        this.updateWords(responseJson.data);
        // responseJson.data.forEach((item, index) => {


        // });
      }).catch((error) => {
          this.attemp++;
          console.log(`FetchError: request to http://mscenglsh.ir/api/app/words?page=67&lastUpdatedAt=${this.last_updated_at}&currentUpdatingAt=${this.current_updating_at} failed, reason:${error}`)
          
          if(this.attemp > 10)
            this.attemp = 0
          else
          {
            console.log(`attemp ${this.attemp}`);
            this.getWords();
          }
            
      });
  }

  updateWords(words)
  {
      
  }

    // updateGroup(words) {
    //     var last_update;
        
    //     db.transaction((tx) => {
    //       tx.executeSql(
    //         `SELECT * FROM other WHERE key='last_updated_at'`,
    //         null,
    //         (txObj,resultSet) => {
    //             console.log(resultSet.rows);
    //         },
    //         (txObj,error) => {
    //             console.log('error when try to get last updated_at',error);
    //         });
    //         words.forEach((item,index) => {
    //             console.log(item);
    //             last_update = item.updated_at;
    //             tx.executeSql(
    //                 `SELECT * FROM words WHERE id=${item.id}`,
    //                 null,
    //                 (txObj, resultSet) => {
    //                   if (resultSet.rows.length && !item.deleted_at) {
    //                       tx.executeSql(
    //                         `UPDATE words SET word=?,translation=?,orderIndex=?,deleted_at=? WHERE id=${item.id}`,
    //                         [
    //                           item.word,
    //                           item.translation,
    //                           item.orderIndex,
    //                           item.deleted_at,
    //                         ],
    //                         (txObj, resultSet) => {
    //                           // console.log(`${item.id} updated`);
    //                         },
    //                         (txObj, error) => console.log(error)
    //                       );
    //                   } else if(!item.deleted_at) {
    //                       tx.executeSql(
    //                         `INSERT INTO words(id,word,translation,orderIndex,deleted_at) VALUES(?,?,?,?,?)`,
    //                         [
    //                           item.id,
    //                           item.word,
    //                           item.translation,
    //                           item.orderIndex,
    //                           item.deleted_at,
    //                         ],
    //                         (txObj, resultSet) => {
    //                           // console.log(`${item.id} created`);
    //                         },
    //                         (txObj, error) => console.log(error)
    //                       );
    //                   }
    //                   else
    //                   {
    //                     tx.executeSql(
    //                       `DELETE FROM words WHERE id=${item.id})`,
    //                       [],
    //                       (txObj, resultSet) => {
    //                         // console.log(`${item.id} deleted`);
    //                       },
    //                       (txObj, error) => console.log(error)
    //                     );
    //                   }
    //                 },
    //                 (txObj, error) => console.log(error)
    //               );
    //         });
            
    //     },(error) => {
    //       console.log('error transaction')
    //       return false;
    //     },
    //     () => {
    //       console.log(`${words.length} rows updated successfully`)
    //       return true;
    //       // db.transaction(tx => { 
    //       // tx.executeSql(
    //       //   `UPDATE other set value=? WHERE key='last_updated_at'`,
    //       //   [last_update],
    //       //   (txObj, resultSet) => {
    //       //     console.log(`last_updated_at update on ${last_update}`);
    //       //   },
    //       //   (txObj, error) => console.log('errorrrrrrrrrrrr',error)
    //       // );
    //       // });
    //     });
    // }
}

module.exports = WordModel;