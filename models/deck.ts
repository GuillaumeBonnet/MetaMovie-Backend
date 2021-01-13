import {
	Sequelize,
	Model,
	ModelDefined,
	DataTypes,
	HasManyGetAssociationsMixin,
	HasManyAddAssociationMixin,
	HasManyHasAssociationMixin,
	Association,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	Optional,
	UUIDV4,
} from "sequelize";
const exp = (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
	// These are all the attributes in the Deck model
	interface DeckAttributes {
		id: string;
		name: string;
		languageTag: string;
	}

	// Some attributes are optional in `Deck.build` and `Deck.create` calls
	interface DeckCreationAttributes extends Optional<DeckAttributes, "id"> {}

	class Deck
		extends Model<DeckAttributes, DeckCreationAttributes>
		implements DeckAttributes {
		id!: string;
		name!: string;
		languageTag!: string;
		// timestamps!
		public readonly createdAt!: Date;
		public readonly updatedAt!: Date;

		// Since TS cannot determine model association at compile time
		// we have to declare them here purely virtually
		// these will not exist until `Model.init` was called.
		public getCards!: HasManyGetAssociationsMixin<Card>; // Note the null assertions!
		public addCard!: HasManyAddAssociationMixin<Card, number>;
		public hasCard!: HasManyHasAssociationMixin<Card, number>;
		public countCards!: HasManyCountAssociationsMixin;
		public createCard!: HasManyCreateAssociationMixin<Card>;

		// You can also pre-declare possible inclusions, these will only be populated if you
		// actively include a relation.
		public readonly cards?: Card[]; // Note this is optional since it's only populated when explicitly requested in code

		public static associations: {
			cards: Association<Deck, Card>;
		};
	}
	Deck.init(
		{
			id: {
				type: DataTypes.UUIDV4,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			name: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			languageTag: {
				type: new DataTypes.STRING(128),
				field: "language_tag",
			},
		},
		{
			sequelize,
			modelName: "Deck",
		}
	);
	return Deck;
};
export default exp;
