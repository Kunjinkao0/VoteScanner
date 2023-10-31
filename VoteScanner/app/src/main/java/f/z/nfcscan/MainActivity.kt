package f.z.nfcscan

import android.app.PendingIntent
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.media.MediaPlayer
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.preference.PreferenceManager
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException

class MainActivity : AppCompatActivity() {
    private var nfcPendingIntent: PendingIntent? = null
    private var nfcAdapter: NfcAdapter? = null

    private lateinit var tagInfoTextView: TextView

    private var nfcTestMode = false;

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tagInfoTextView = findViewById<TextView>(R.id.result)

        if (!packageManager.hasSystemFeature(PackageManager.FEATURE_NFC)) {
            updateTextView("Current device doesn't support NFC.")
            return
        }

        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        if (nfcAdapter?.isEnabled == false) {
            updateTextView("NFC is not enabled on your device, please turn on the NFC first.")
            return
        }

        nfcPendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            PendingIntent.FLAG_MUTABLE
        )
    }

    override fun onResume() {
        super.onResume()
        checkHostFromPref()
        nfcAdapter?.enableForegroundDispatch(this, nfcPendingIntent, null, null)
    }

    private fun checkHostFromPref() {
        val sharedPreferences: SharedPreferences =
            PreferenceManager.getDefaultSharedPreferences(this)
        val apiHost = sharedPreferences.getString("api_host", getString(R.string.default_host))!!
        nfcTestMode = apiHost == "192.168.1.1" || apiHost == "1"
        API_HOST = apiHost

        // nfcTestMode ? "" : "" is not working here, strange kotlin
        findViewById<TextView>(R.id.ip).text = (if (nfcTestMode) "NFC test" else apiHost)
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableForegroundDispatch(this)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_settings -> {
                startActivity(Intent(this, SettingsActivity::class.java))
                true
            }
//            R.id.action_control -> {
//                startActivity(Intent(this, ControllerActivity::class.java))
//                true
//            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        if (NfcAdapter.ACTION_TAG_DISCOVERED == intent.action) {
            val tag = intent.getParcelableExtra<Tag>(NfcAdapter.EXTRA_TAG)
            val deviceId = bytesToHexString(tag?.id)

            if (nfcTestMode) {
                updateTextView("DeviceId: ${deviceId}")
            } else {
                voteCall(deviceId)
            }
        }
    }

    private fun updateTextView(result: String) {
        runOnUiThread {
            tagInfoTextView.text = result
        }
    }

    private fun playSoundEffect(audioResourceId: Int) {
        val mediaPlayer = MediaPlayer.create(this, audioResourceId)
        mediaPlayer.start()
        mediaPlayer.setOnCompletionListener { mediaPlayer.release() }
    }

    private fun voteCall(deviceId: String) {
        updateTextView("Submitting...")
        val url = "${API_HOST}/vote/submit?deviceId=${deviceId}"
        val client = OkHttpClient()
        val request = Request.Builder().url(url).get().build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e(TAG_OKHTTP, e.toString())
                playSoundEffect(R.raw.read_invalid)
                updateTextView("Failed\n${e.toString()}")
            }

            override fun onResponse(call: Call, response: Response) {
                val data = response.body!!.string()
                if (response.isSuccessful) {
                    Log.v(TAG_OKHTTP, data)
                    updateTextView("Succeed\n${deviceId}")
                    playSoundEffect(R.raw.read_success)
                } else {
                    Log.e(TAG_OKHTTP, "ERROR in ${url}: ${response.message}")
                    Log.e(TAG_OKHTTP, data)
                    updateTextView("Failed\n${data}")
                    playSoundEffect(R.raw.read_invalid)
                }
            }
        })
    }
}