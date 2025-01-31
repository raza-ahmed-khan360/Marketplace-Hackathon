"use client"
import React, { useState } from 'react';
import type { NextPage } from 'next';
import Image from "next/image";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: NextPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "How can we get in touch with you?",
      answer: "You can reach us via email at support@example.com or call us at (123) 456-7890."
    },
    {
      question: "What types of chairs do you offer?",
      answer: "We offer a variety of chairs including office chairs, gaming chairs, and ergonomic chairs."
    },
    {
      question: "Do your chairs come with a warranty?",
      answer: "Yes, all our chairs come with a 2-year warranty covering manufacturing defects."
    },
    {
      question: "Can I try a chair before purchasing?",
      answer: "Yes, you can visit our showroom to try out our chairs before making a purchase."
    },
    {
      question: "What will be delivered? And When?",
      answer: "Your order will include the chair and assembly instructions. Delivery typically takes 3-5 business days."
    },
    {
      question: "How do I clean and maintain my Comforty chair?",
      answer: "To clean your chair, use a damp cloth with mild soap. Avoid using harsh chemicals. Regularly check and tighten screws to maintain stability."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto w-auto font-inter px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Questions Looks Here
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry standard dummy text.
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300"
          >
            <div 
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center p-6 cursor-pointer bg-gray-50 hover:bg-gray-scales-off-white"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {faq.question}
              </h3>
              <Image 
                src="/FAQ/Plus.svg" 
                alt="Expand" 
                width={24} 
                height={24} 
                className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`} 
              />
            </div>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px]' : 'max-h-0'}`}
            >
              {openIndex === index && (
                <div className="p-6 pt-3 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
