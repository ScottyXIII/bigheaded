// @ts-expect-error this is generic helper to instanticate classes without the 'new' keyword
// this can be needed when the class does not need to have any code access the instance variables or methods
// and typescript starts complaining, but you dont want to needlessly create class vars for it's ref on the scene
const noNew = (Class, ...other) => new Class(...other);

export default noNew;
