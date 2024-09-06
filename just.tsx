{
  "salons": [
    {
      "id": 1,
      "name": "Luxury Salon",
      "description": "Premium salon offering top-notch services.",
      "location": "Downtown",
      "services": [
        {
          "id": 1,
          "name": "Haircut",
          "price": 15000
        },
        {
          "id": 2,
          "name": "Manicure",
          "price": 10000
        }
      ],
      "products": [
        {
          "id": 1,
          "name": "Shampoo",
          "price": 20000,
          "image": "https://example.com/shampoo.jpg"
        },
        {
          "id": 2,
          "name": "Conditioner",
          "price": 15000,
          "image": "https://example.com/conditioner.jpg"
        }
      ]
    },
    {
      "id": 2,
      "name": "Glamour Salon",
      "description": "Affordable salon with quality services.",
      "location": "Uptown",
      "services": [
        {
          "id": 3,
          "name": "Facial",
          "price": 20000
        },
        {
          "id": 4,
          "name": "Pedicure",
          "price": 12000
        }
      ],
      "products": [
        {
          "id": 3,
          "name": "Hair Gel",
          "price": 10000,
          "image": "https://example.com/hair-gel.jpg"
        },
        {
          "id": 4,
          "name": "Hair Spray",
          "price": 18000,
          "image": "https://example.com/hair-spray.jpg"
        }
      ]
    }
  ],
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "cart": [
        {
          "productId": 1,
          "quantity": 2
        },
        {
          "productId": 3,
          "quantity": 1
        }
      ],
      "orders": [
        {
          "orderId": 1,
          "products": [
            {
              "productId": 2,
              "quantity": 1,
              "price": 15000
            }
          ],
          "totalPrice": 15000,
          "status": "Pending",
          "createdAt": "2024-08-31T14:48:00.000Z"
        }
      ]
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "cart": [],
      "orders": [
        {
          "orderId": 2,
          "products": [
            {
              "productId": 1,
              "quantity": 1,
              "price": 20000
            },
            {
              "productId": 4,
              "quantity": 2,
              "price": 36000
            }
          ],
          "totalPrice": 56000,
          "status": "Completed",
          "createdAt": "2024-08-30T10:30:00.000Z"
        }
      ]
    }
  ],
  "orders": [
    {
      "orderId": 1,
      "userId": 1,
      "products": [
        {
          "productId": 2,
          "quantity": 1,
          "price": 15000
        }
      ],
      "totalPrice": 15000,
      "status": "Pending",
      "createdAt": "2024-08-31T14:48:00.000Z"
    },
    {
      "orderId": 2,
      "userId": 2,
      "products": [
        {
          "productId": 1,
          "quantity": 1,
          "price": 20000
        },
        {
          "productId": 4,
          "quantity": 2,
          "price": 36000
        }
      ],
      "totalPrice": 56000,
      "status": "Completed",
      "createdAt": "2024-08-30T10:30:00.000Z"
    }
  ],
  "categories": [
    {
      "name": "Perfumes",
      "image":
        "https://img.freepik.com/free-photo/bottle-perfume-with-purple-orange-background_1340-38051.jpg?ga=GA1.1.476787416.1724867277&semt=ais_hybrid",
    },
    {
      "name": "Cosmetics",
      "image":
        "https://img.freepik.com/free-photo/creative-display-makeup-products_23-2150063088.jpg?t=st=1725197342~exp=1725200942~hmac=0c92b67a30e5d71ab52b08ffbc1dddfdc074a5d84df08fc0e30bfa3da6928c30&w=826",
    },
    {
      "name": "Wigs",
      "image":
        "https://img.freepik.com/free-photo/black-woman-touches-her-curly-hair_633478-2354.jpg?t=st=1725197139~exp=1725200739~hmac=7a8bbd08994c54d8a935b0cf6455e7a4aab130937651bd3771e55a6ba936fe90&w=996",
    },
    {
      "name": "Pedicure",
      "image":
        "https://img.freepik.com/free-photo/pedicure-process-home-salon-pedicure-foot-care-treatment-nail-process-professional-pedicures-master-blue-gloves-make-pedicure_343596-1601.jpg?t=st=1725197472~exp=1725201072~hmac=e60ce816cee17d969b35c0cdef91e19fa6878b911bfac8ceb2dd439c6b478b55&w=996",
    }
  ]
}