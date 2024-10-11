import lunr from "lunr";

var documents = [
  {
    _id: { $oid: "67043da159b81b2392d5fdd1" },
    name: "Science",
    userId: { $oid: "6706ae5620ddfa895384ff50" },
    topics: [
      { $oid: "67043da259b81b2392d5fdd5" },
      { $oid: "67043da259b81b2392d5fdd6" },
      { $oid: "67043da259b81b2392d5fdd7" },
    ],
    omniposts: [
      { $oid: "6707bf9c18d2284027625f20" },
      { $oid: "6707bc00ca4d7d6bda5aa91d" },
    ],
    __v: { $numberInt: "1" },
  },
  {
    _id: { $oid: "67065a19157d89104ba7ad52" },
    name: "Physics",
    userId: { $oid: "6706ae5620ddfa895384ff50" },
    topics: [
      { $oid: "67065a19157d89104ba7ad56" },
      { $oid: "67065a19157d89104ba7ad57" },
      { $oid: "67065a19157d89104ba7ad58" },
    ],
    omniposts: [],
    __v: { $numberInt: "1" },
  },
  {
    _id: { $oid: "67065aaca338fa5937643dee" },
    name: "Linear Algebra",
    userId: { $oid: "6706ae5620ddfa895384ff50" },
    topics: [
      { $oid: "67065aada338fa5937643df2" },
      { $oid: "67065aada338fa5937643df3" },
      { $oid: "67065aada338fa5937643df4" },
    ],
    omniposts: [],
    __v: { $numberInt: "1" },
  },
  {
    _id: { $oid: "67065d1ca338fa5937643e08" },
    name: "Science of Computers",
    userId: { $oid: "6706ae5620ddfa895384ff50" },
    topics: [
      { $oid: "67065d1ca338fa5937643e0c" },
      { $oid: "67065d1ca338fa5937643e0d" },
      { $oid: "67065d1ca338fa5937643e0e" },
    ],
    omniposts: [],
    __v: { $numberInt: "1" },
  },
];

var idx = lunr(function () {
  this.ref("name");
  this.field("name");

  documents.forEach((doc) => {
    this.add(doc);
  }, this);
});

const result = idx.search("Linear Physics");
console.log(result);

// console.log(result[0].score - result[1].score);
// console.log(result[0]);

// console.log(JSON.parse(result[0].ref));
