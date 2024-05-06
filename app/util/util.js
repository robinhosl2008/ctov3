import moment from 'moment';

export default {
    
    obj_filter(obj, condition){
        let newObj = {}
        for (const [key, value] of Object.entries(obj)) {
            if (condition(value)) {
                newObj = { ...newObj, [key]: value }
            }
        }
        return newObj
    },

    obj_size(obj){
        let size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    },
    obj_to_array(obj){
        return Object.entries(obj).map((e) => (e[1]));
    },
    order_by(key, order = 'asc') {
        return function innerSort(a, b) {
          if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
          }
      
          const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];
      
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          );
        };
    },

    /** DATE & TIME **/
    diff_in_days(strDate){
        let a = moment();
        let b = moment(strDate, "YYYY-MM-DD HH:mm:ss");
        return a.diff(b, 'days');
    },

    now(strFormat){
      let format = (strFormat) ? strFormat : "YYYY-MM-DD HH:mm:ss"; 
      return moment().format(format);
    },

    get_unix(){
      return moment().unix();
    },

    paginate(array, page_size, page_number) {
      // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
      //console.log(typeof array );
      //console.log(array);
      return array.slice((page_number - 1) * page_size, page_number * page_size);
    },

    fileNameAndExt(str){
      let file = str.split('/').pop();
      let arr_filename = [file.substr(0,file.lastIndexOf('.')),file.substr(file.lastIndexOf('.')+1,file.length)];
      return `${arr_filename[0]}.${arr_filename[1]}`;
    },

    dataUS2BR(str){
      return moment(str, 'YYYY-MM-DD', true).format('DD/MM/YYYY');
    },

    dataHoraUS2BR(str){
      return moment(str, 'YYYY-MM-DD HH:mm:ss', true).format('DD/MM/YYYY HH:mm:ss');
    },

    beginsWith(needle, haystack){
      return (haystack.substr(0, needle.length) == needle);
    }

}
