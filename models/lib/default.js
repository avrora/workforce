GeoLocationSchema = new SimpleSchema({
    lat: {
        type: Number,
        decimal: true
    },
    lng: {
        type: Number,
        decimal: true
    }
});

referenceType = {
    type: String,
    regEx: SimpleSchema.RegEx.Id
};


