const VariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter variant name"],
  },
  options: [
    {
      type: String,
      required: [true, "Please enter variant option"],
    },
  ],
});
export default mongoose.models.Variant ||
  mongoose.model("Variant", VariantSchema);
