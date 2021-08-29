import { faker } from 'https://deno.land/x/deno_faker@v1.0.3/mod.ts';
import { v4 } from 'https://deno.land/std@0.100.0/uuid/mod.ts';
import UserRepo from "../src/repositories/UserRepo.ts";
import {User} from "../src/models/User.ts";
import {Tag} from "../src/models/Tag.ts";
import TagRepo from "../src/repositories/TagRepo.ts";
import {Organization} from "../src/models/Organization.ts";
import OrganizationRepo from "../src/repositories/OrganizationRepo.ts";
import {Alert} from "../src/models/Alert.ts";
import AlertRepo from "../src/repositories/AlertRepo.ts";

const startTime = new Date().getTime();

faker.seed(Math.floor(10_000_000_000 * Math.random()));

function sliceIntoChunks(arr: Array<any>, chunkSize: number) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

function sample(population: Array<any>, k: number){
    /*
        Chooses k unique random elements from a population sequence or set.

        Returns a new list containing elements from the population while
        leaving the original population unchanged.  The resulting list is
        in selection order so that all sub-slices will also be valid random
        samples.  This allows raffle winners (the sample) to be partitioned
        into grand prize and second place winners (the subslices).

        Members of the population need not be hashable or unique.  If the
        population contains repeats, then each occurrence is a possible
        selection in the sample.

        To choose a sample in a range of integers, use range as an argument.
        This is especially fast and space efficient for sampling from a
        large population:   sample(range(10000000), 60)

        Sampling without replacement entails tracking either potential
        selections (the pool) in a list or previous selections in a set.

        When the number of selections is small compared to the
        population, then tracking selections is efficient, requiring
        only a small set and an occasional reselection.  For
        a larger number of selections, the pool tracking method is
        preferred since the list takes less space than the
        set and it doesn't suffer from frequent reselections.
    */

    if(!Array.isArray(population))
        throw new TypeError("Population must be an array.");
    var n = population.length;
    if(k < 0 || k > n)
        throw new RangeError("Sample larger than population or is negative");

    var result = new Array(k);
    var setsize = 21;   // size of a small set minus size of an empty list

    if(k > 5)
        setsize += Math.pow(4, Math.ceil(Math.log(k * 3) / Math.log(4)))

    if(n <= setsize){
        // An n-length list is smaller than a k-length set
        var pool = population.slice();
        for(var i = 0; i < k; i++){          // invariant:  non-selected at [0,n-i)
            var j = Math.random() * (n - i) | 0;
            result[i] = pool[j];
            pool[j] = pool[n - i - 1];       // move non-selected item into vacancy
        }
    }else{
        var selected = new Set();
        for(var i = 0; i < k; i++){
            var j = Math.random() * n | 0;
            while(selected.has(j)){
                j = Math.random() * n | 0;
            }
            selected.add(j);
            result[i] = population[j];
        }
    }

    return result;
}

let count = 0;
let users = [];
let tags = [];
let organizations: Array<Organization> = [];
let alerts: Array<Alert> = [];

const startGenerationTime = new Date().getTime();

while (organizations.length < 500000) {
    const organization = new Organization({
        id: v4.generate(),
        name: faker.company.companyName(),
    });

    organizations.push(organization);
}

while (count < 300000) {
    const user = new User({
        id: v4.generate(),
        email: faker.unique(faker.internet.email, [], { maxTime: 100000, maxRetries: 4000}),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
    });
    users.push(user);

    let tagCount = 0;

    while (tagCount < 7) {
        const org = sample(organizations, 1)[0];
        const tag = new Tag({
            id: v4.generate(),
            name: faker.lorem.words(Math.floor(1 + Math.random()*(4 + 1 - 1))),
            ownerId: user.id,
        });
        tags.push(tag);

        const alert = new Alert({
            id: v4.generate(),
            description: faker.lorem.sentence(),
            userId: user.id,
            organizationId: org.id,
            read: Math.random() < 0.5,
        });

        alerts.push(alert);
        tagCount += 1;
    }

    count += 1;
}

const endGenerationTime = new Date().getTime();

console.log('Generation time', (endGenerationTime - startGenerationTime) / 1000);

let saveLength = 0;
let orgChunks: Array<Array<Organization>> = sliceIntoChunks(organizations, 30000);
console.log('Org chunks to save', orgChunks.length);
for (let org of orgChunks) {
    await OrganizationRepo.createMany(org);
    console.log('Saved chunk', saveLength++);
}
orgChunks = [];
organizations = [];
console.log('Organizations Created');
saveLength = 0;

let userChunks: Array<Array<User>> = sliceIntoChunks(users, 30000);
console.log('User chunks to save', userChunks.length);

for (let user of userChunks) {
    await UserRepo.createMany(user);
    console.log('Saved chunk', saveLength++);
}
console.log('Users Created');
userChunks = [];
users = [];

saveLength = 0;
let tagChunks: Array<Array<Tag>> = sliceIntoChunks(tags, 30000);
console.log('Tag chunks to save', tagChunks.length);

for (let tag of tagChunks) {
    await TagRepo.createMany(tag);
    console.log('Saved chunk', saveLength++);
}
console.log('Tags created');
tagChunks = [];
tags = [];
saveLength = 0;
let alertChunks = sliceIntoChunks(alerts, 40000);
console.log('Alert chunks to save', alertChunks.length);

for (let arr of alertChunks) {
    await AlertRepo.createMany(arr);
    console.log('Saved chunk', saveLength++);
}
console.log('Alerts Created');
saveLength = 0;
alertChunks = [];
alerts = [];
const endTime = new Date().getTime();

console.log('Seed time', (endTime - startTime) / 1000);

Deno.exit(0);
