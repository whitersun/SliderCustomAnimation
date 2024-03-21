function watchAnyObject(
    object = {},
    methods = [],
    callbackBefore = function () {},
    callbackAfter = function () {},
) {
    for (let method of methods) {
        const original = object[method].bind(object);
        const newMethod = function (...args) {
        
            callbackBefore(method, ...args);

            const result = original.apply(null, args);
            callbackAfter(method, ...args);
            return result;
        };
        object[method] = newMethod.bind(object);
    }
}

watchAnyObject(
    window.localStorage,
    ['setItem', 'getItem', 'removeItem'],
    (method, key, ...args) =>
        console.log(`call ${method} with key ${key} and args ${args}`),
);