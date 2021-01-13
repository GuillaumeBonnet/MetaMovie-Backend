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

const sequelize = new Sequelize("mysql://root:asd123@localhost:3306/mydb");

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

type CrudStatus = "SYNCED" | "TO_CREATE" | "TO_UPDATE" | "TO_DELETE";
interface CardAttributes {
	id: number;
	crudStatus: CrudStatus;
	deckId: string;
	text: string;
	from: string;
	to: string;
	position: { x: number; y: number };
	position_x: number;
	position_y: number;
	deckOrder: number;
}

interface CardCreationAttributes extends Optional<CardAttributes, "id"> {}

class Card
	extends Model<CardAttributes, CardCreationAttributes>
	implements CardAttributes {
	id!: number;
	crudStatus!: CrudStatus;
	deckId!: string;
	text!: string;
	from!: string;
	to!: string;
	position!: { x: number; y: number };
	position_x!: number;
	position_y!: number;
	deckOrder!: number;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Card.init(
	{
		id: {
			type: DataTypes.UUIDV4,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		crudStatus: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		deckId: {
			type: DataTypes.UUIDV4,
			allowNull: false,
			field: "deck_id",
		},
		text: {
			type: new DataTypes.STRING(500),
			allowNull: false,
		},
		from: {
			type: new DataTypes.STRING(8),
			allowNull: false,
			field: "from_moment",
		},
		to: {
			type: new DataTypes.STRING(8),
			allowNull: false,
			field: "to_moment",
		},
		position: {
			type: DataTypes.VIRTUAL,
			get() {
				return {
					x: this.position_x,
					y: this.position_y,
				};
			},
			set(position: { x: number; y: number }) {
				this.setDataValue("position_x", position.x);
				this.setDataValue("position_y", position.y);
			},
		},
		position_x: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		position_y: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		deckOrder: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "deck_order",
		},
	},
	{
		sequelize,
		tableName: "cards",
	}
);

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
		tableName: "decks",
		sequelize, // passing the `sequelize` instance is required
	}
);

// Here we associate which actually populates out pre-declared `association` static and other methods.
Deck.hasMany(Card, {
	sourceKey: "id",
	foreignKey: "deckId",
	as: "cards", // this determines the name in `associations`!
});
