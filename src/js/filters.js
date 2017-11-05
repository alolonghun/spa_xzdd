module.exports = {
    abs: function(value) {
        if (typeof(value) == 'number') {
            return Math.abs(value);
        }
        return value;
    },
    decimal2: function(value) {
        if (typeof(value) == 'number') {
            return value.toFixed(2);
        }
        return value;
    },
    amount: function(value) {
        if (typeof(value) == 'number') {
            return value.toFixed(2);
        }
        return value;
    }
};
