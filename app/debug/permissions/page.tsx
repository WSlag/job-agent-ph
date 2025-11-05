'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Button from '@/components/ui/Button'

export default function PermissionsDebugPage() {
  const { user, userProfile, userType } = useAuth()
  const [diagnosis, setDiagnosis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fixing, setFixing] = useState(false)
  const [message, setMessage] = useState('')

  const runDiagnosis = async () => {
    if (!user) {
      setMessage('Please login first')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const userId = user.uid

      // Check users collection
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)

      // Check jobHunters collection
      const jobHunterDocRef = doc(db, 'jobHunters', userId)
      const jobHunterDoc = await getDoc(jobHunterDocRef)

      // Check agencies collection
      const agencyDocRef = doc(db, 'agencies', userId)
      const agencyDoc = await getDoc(agencyDocRef)

      const results = {
        userId,
        email: user.email,
        hasUserDoc: userDoc.exists(),
        hasJobHunterDoc: jobHunterDoc.exists(),
        hasAgencyDoc: agencyDoc.exists(),
        userData: userDoc.exists() ? userDoc.data() : null,
        jobHunterData: jobHunterDoc.exists() ? jobHunterDoc.data() : null,
        agencyData: agencyDoc.exists() ? agencyDoc.data() : null,
        userProfile,
        userType,
      }

      setDiagnosis(results)

      // Determine if there's an issue
      if (!results.hasUserDoc) {
        setMessage('❌ PROBLEM: Missing document in "users" collection. Click "Fix" to create it.')
      } else if (results.userData?.userType !== userType) {
        setMessage(`⚠️ WARNING: userType mismatch. users collection says "${results.userData?.userType}" but context says "${userType}"`)
      } else {
        setMessage('✅ All looks good! Permissions should work correctly.')
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
      console.error('Diagnosis error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fixPermissions = async () => {
    if (!user || !diagnosis) return

    setFixing(true)
    setMessage('')

    try {
      const userId = user.uid

      // Determine user type from other collections
      let userType: 'jobhunter' | 'agency' | 'admin' | null = null
      let email = user.email || ''

      if (diagnosis.hasJobHunterDoc && diagnosis.jobHunterData) {
        userType = 'jobhunter'
        email = diagnosis.jobHunterData.email || email
      } else if (diagnosis.hasAgencyDoc && diagnosis.agencyData) {
        userType = 'agency'
        email = diagnosis.agencyData.email || email
      }

      if (!userType) {
        setMessage('❌ Cannot determine user type. Please contact support.')
        return
      }

      // Create or update the users document
      const userDoc = {
        email,
        userType,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(doc(db, 'users', userId), userDoc, { merge: true })

      setMessage('✅ Successfully fixed! Please refresh the page and try applying again.')

      // Run diagnosis again
      setTimeout(runDiagnosis, 1000)
    } catch (error: any) {
      setMessage(`❌ Failed to fix: ${error.message}`)
      console.error('Fix error:', error)
    } finally {
      setFixing(false)
    }
  }

  useEffect(() => {
    if (user) {
      runDiagnosis()
    }
  }, [user])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Permissions Diagnostic</h1>
        <p className="text-gray-600">Please login to run diagnostics</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Permissions Diagnostic</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current User</h2>
        <div className="space-y-2 text-sm">
          <p><strong>User ID:</strong> {user.uid}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User Type (Context):</strong> {userType || 'Not loaded'}</p>
        </div>
      </div>

      {message && (
        <div className={`rounded-lg p-4 mb-6 ${
          message.startsWith('✅') ? 'bg-green-50 text-green-800 border border-green-200' :
          message.startsWith('⚠️') ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
          message.startsWith('❌') ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message}
        </div>
      )}

      {diagnosis && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Diagnosis Results</h2>

          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-medium mb-2">
                {diagnosis.hasUserDoc ? '✅' : '❌'} Users Collection
              </h3>
              {diagnosis.hasUserDoc ? (
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(diagnosis.userData, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-red-600">Document not found (This causes permission errors!)</p>
              )}
            </div>

            <div className="border-b pb-3">
              <h3 className="font-medium mb-2">
                {diagnosis.hasJobHunterDoc ? '✅' : 'ℹ️'} JobHunters Collection
              </h3>
              {diagnosis.hasJobHunterDoc ? (
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(diagnosis.jobHunterData, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-gray-600">No document (expected if you're an agency)</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">
                {diagnosis.hasAgencyDoc ? '✅' : 'ℹ️'} Agencies Collection
              </h3>
              {diagnosis.hasAgencyDoc ? (
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(diagnosis.agencyData, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-gray-600">No document (expected if you're a job hunter)</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={runDiagnosis}
          disabled={loading}
        >
          {loading ? 'Running Diagnosis...' : 'Run Diagnosis'}
        </Button>

        {diagnosis && !diagnosis.hasUserDoc && (
          <Button
            onClick={fixPermissions}
            disabled={fixing}
            variant="primary"
          >
            {fixing ? 'Fixing...' : 'Fix Permissions'}
          </Button>
        )}
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">About This Issue</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>The Problem:</strong> Firestore security rules require a document in the "users" collection
            to determine if you're a job hunter or agency. Without this document, all write operations fail.
          </p>
          <p>
            <strong>The Solution:</strong> Click "Fix Permissions" to create the missing document. This will
            allow you to apply to jobs and perform other actions.
          </p>
          <p>
            <strong>Why This Happens:</strong> Sometimes the signup process may not create all required documents,
            or existing users from before this validation was added may be affected.
          </p>
        </div>
      </div>
    </div>
  )
}
