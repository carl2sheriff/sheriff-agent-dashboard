const express = require('express')
const fetch = require('node-fetch')

const router = express.Router()

const RAILWAY_PROJECT_ID = '63830b39-2415-4c9e-ba52-79a6053a8dab'
const RAILWAY_API_URL = 'https://backboard.railway.app/graphql/v2'

// GET /api/railway/services — fetch services from Railway GraphQL API
router.get('/services', async (req, res) => {
  const token = process.env.RAILWAY_API_TOKEN

  if (!token) {
    return res.json({
      projectId: RAILWAY_PROJECT_ID,
      services: [],
      error: 'RAILWAY_API_TOKEN not configured',
      note: 'Set RAILWAY_API_TOKEN in .env to enable Railway integration',
    })
  }

  const query = `
    query GetProject($projectId: String!) {
      project(id: $projectId) {
        id
        name
        services {
          edges {
            node {
              id
              name
              deployments(first: 1) {
                edges {
                  node {
                    id
                    status
                    createdAt
                    url
                    meta
                  }
                }
              }
            }
          }
        }
        environments {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch(RAILWAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { projectId: RAILWAY_PROJECT_ID },
      }),
    })

    const data = await response.json()

    if (data.errors) {
      return res.status(500).json({
        error: 'Railway API error',
        details: data.errors,
      })
    }

    const project = data.data?.project
    if (!project) {
      return res.status(404).json({ error: 'Project not found on Railway' })
    }

    const services = project.services.edges.map(({ node: service }) => {
      const latestDeployment = service.deployments.edges[0]?.node

      return {
        id: service.id,
        name: service.name,
        status: latestDeployment?.status || 'UNKNOWN',
        latestDeployment: latestDeployment
          ? {
              id: latestDeployment.id,
              status: latestDeployment.status,
              createdAt: latestDeployment.createdAt,
              url: latestDeployment.url,
            }
          : null,
      }
    })

    res.json({
      projectId: RAILWAY_PROJECT_ID,
      projectName: project.name,
      environments: project.environments.edges.map(({ node }) => ({ id: node.id, name: node.name })),
      services,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch Railway services',
      message: error.message,
    })
  }
})

// GET /api/railway/project — basic project info
router.get('/project', async (req, res) => {
  const token = process.env.RAILWAY_API_TOKEN

  if (!token) {
    return res.json({
      projectId: RAILWAY_PROJECT_ID,
      name: 'balanced-abundance',
      url: `https://railway.app/project/${RAILWAY_PROJECT_ID}`,
      error: 'RAILWAY_API_TOKEN not configured',
    })
  }

  res.json({
    projectId: RAILWAY_PROJECT_ID,
    name: 'balanced-abundance',
    url: `https://railway.app/project/${RAILWAY_PROJECT_ID}`,
  })
})

module.exports = router
