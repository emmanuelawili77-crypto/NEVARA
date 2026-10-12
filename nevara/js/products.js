/*
  NÉVARA — product catalogue
  Edit names, prices, sizes and descriptions here. Every page (shop, product,
  bag, wishlist) reads from this one file. Images live in images/products/.
  Prices are in naira (whole numbers, no commas).
*/
window.NEVARA_PRODUCTS = [
    {
        id: 'signature-shirt',
        name: 'NÉVARA Signature Shirt',
        price: 45000,
        label: 'SHIRTS',
        categories: ['men'],
        collections: ['lagos-edit'],
        tag: 'NEW',
        image: 'images/products/signature-shirt.jpg',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'A relaxed camp-collar shirt in cream, finished with hand-drawn pattern panels down the front. Easy, elevated and made for evenings by the water.',
        details: ['Relaxed fit', 'Camp collar with button front', 'Pattern panels on front and sleeves', 'Designed in Lagos']
    },
    {
        id: 'lagos-tee',
        name: 'Lagos Oversized Tee',
        price: 32000,
        label: 'STREETWEAR',
        categories: ['streetwear', 'men', 'women'],
        collections: ['lagos-edit'],
        tag: '',
        image: 'images/products/lagos-tee.jpg',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'An oversized black tee with a printed pattern panel across the shoulder and the NÉVARA wordmark at the chest. Built for the city.',
        details: ['Oversized fit', 'NÉVARA wordmark print', 'Pattern panel detail', 'Designed in Lagos']
    },
    {
        id: 'heritage-set',
        name: 'Heritage Two-Piece',
        price: 85000,
        label: 'HERITAGE',
        categories: ['women', 'heritage'],
        collections: [],
        tag: 'LIMITED',
        image: 'images/products/heritage-set.jpg',
        sizes: ['XS', 'S', 'M', 'L'],
        description: 'A sculpted two-piece in deep green and gold print, with a structured bodice and sweeping statement sleeves. Made for the moments you want remembered.',
        details: ['Structured bodice', 'Statement sleeve detail', 'Green and gold print', 'Limited availability']
    },
    {
        id: 'kaftan',
        name: 'Signature Kaftan',
        price: 75000,
        label: 'TRADITIONAL',
        categories: ['men', 'heritage'],
        collections: [],
        tag: '',
        image: 'images/products/kaftan.jpg',
        sizes: ['M', 'L', 'XL', 'XXL'],
        description: 'A flowing deep-green kaftan with intricate gold embroidery along the neckline. Traditional in spirit, modern in proportion.',
        details: ['Wide, flowing silhouette', 'Gold embroidered neckline panel', 'Deep green with tonal pattern', 'Designed in Lagos']
    },
    {
        id: 'linen-trousers',
        name: 'Lagos Linen Trousers',
        price: 38000,
        label: 'TROUSERS',
        categories: ['men'],
        collections: ['lagos-edit'],
        tag: '',
        image: 'images/products/linen-trousers.jpg',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Light, tailored trousers in cream with a subtle pattern trim down the side. Made to pair with the Signature Shirt, or stand alone.',
        details: ['Tailored, straight leg', 'Pattern trim detail', 'Cream', 'Designed in Lagos']
    },
    {
        id: 'pattern-tee',
        name: 'Pattern Panel Tee',
        price: 32000,
        label: 'STREETWEAR',
        categories: ['streetwear', 'men', 'women'],
        collections: ['lagos-edit'],
        tag: 'NEW',
        image: 'images/products/pattern-tee.jpg',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'An off-white oversized tee with a bold black pattern panel at the hem and the NÉVARA wordmark at the chest.',
        details: ['Oversized fit', 'Bold pattern panel at hem', 'NÉVARA wordmark print', 'Designed in Lagos']
    },
    {
        id: 'crop-tank',
        name: 'NÉVARA Crop Tank',
        price: 22000,
        label: 'TOPS',
        categories: ['women', 'streetwear'],
        collections: ['lagos-edit'],
        tag: '',
        image: 'images/products/crop-tank.jpg',
        sizes: ['XS', 'S', 'M', 'L'],
        description: 'A clean black cropped tank with a fine NÉVARA wordmark at the chest. Layer it under the pattern-lined jacket or wear it alone.',
        details: ['Cropped fit', 'Fine wordmark print', 'Black', 'Designed in Lagos']
    },
    {
        id: 'cargo-trousers',
        name: 'Wide-Leg Cargo Trousers',
        price: 48000,
        label: 'TROUSERS',
        categories: ['streetwear', 'women', 'men'],
        collections: ['lagos-edit'],
        tag: '',
        image: 'images/products/cargo-trousers.jpg',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: 'High-waisted, wide-leg cargo trousers in black with contrast stitching and generous utility pockets.',
        details: ['High waist, wide leg', 'Utility pockets', 'Contrast stitching', 'Black']
    },
    {
        id: 'gele-headwrap',
        name: 'Gele Headwrap',
        price: 18000,
        label: 'ACCESSORIES',
        categories: ['women', 'heritage'],
        collections: [],
        tag: '',
        image: 'images/products/gele-headwrap.jpg',
        sizes: ['One size'],
        description: 'A sculpted headwrap in the same green and gold print as the Heritage Two-Piece. The finishing touch.',
        details: ['One size', 'Green and gold print', 'Pairs with the Heritage Two-Piece']
    },
    {
        id: 'statement-shawl',
        name: 'Heritage Statement Shawl',
        price: 65000,
        label: 'HERITAGE',
        categories: ['women', 'heritage'],
        collections: [],
        tag: '',
        image: 'images/products/statement-shawl.jpg',
        sizes: ['One size'],
        description: 'A dramatic oversized shawl in green and gold print, worn draped over one shoulder for instant presence.',
        details: ['Oversized drape', 'Green and gold print', 'One size']
    }
];

window.NEVARA_CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'streetwear', label: 'Streetwear' },
    { id: 'heritage', label: 'Heritage' }
];

window.NEVARA_COLLECTIONS = {
    'lagos-edit': 'The Lagos Edit'
};
