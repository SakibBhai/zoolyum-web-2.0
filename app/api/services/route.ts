import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // For now, return mock services data since there's no services table in the schema
    // You can replace this with actual database queries when the services table is created
    const services = [
      {
        id: '1',
        title: 'Web Development',
        description: 'Custom web applications built with modern technologies',
        slug: 'web-development',
        icon: 'Code',
        features: ['Responsive Design', 'Modern Frameworks', 'Performance Optimization'],
        price: 'Starting at $2,500',
        duration: '4-8 weeks',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications',
        slug: 'mobile-development',
        icon: 'Smartphone',
        features: ['iOS & Android', 'Cross-platform', 'App Store Deployment'],
        price: 'Starting at $5,000',
        duration: '8-12 weeks',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'UI/UX Design',
        description: 'User-centered design for digital products',
        slug: 'ui-ux-design',
        icon: 'Palette',
        features: ['User Research', 'Wireframing', 'Prototyping'],
        price: 'Starting at $1,500',
        duration: '2-4 weeks',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For now, return a mock response since there's no services table
    // You can implement actual service creation when the services table is added
    const newService = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}