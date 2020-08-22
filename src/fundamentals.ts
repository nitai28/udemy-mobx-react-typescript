// @ts-nocheck

const person = {
    firstName: 'MobX',
    lastName: 'React',
};

let reaction;

const mobx = {
    autorun: function (cb) {
        reaction = cb;
        cb();
        reaction = null;
    },
    observable: function (obj) {
        const reactions = new Set();

        const handler = {
            get: function (obj, prop) {
                if (reaction) {
                    reactions.add(reaction);
                }

                return obj[prop];
            },
            set: function (obj, prop, value) {
                obj[prop] = value;

                for (reaction of reactions) {
                    reaction();
                }

                return true;
            }
        }
        return new Proxy(obj, handler);
    },
};

const ourPerson = mobx.observable(person);

mobx.autorun(() => {
   console.log(`Our Person: ${ourPerson.firstName} ${ourPerson.lastName}`);
});

mobx.autorun(() => {
    console.log(`Second AutoRun: ${ourPerson.lastName}`);
});

ourPerson.firstName = 'New Name';

export {mobx};
